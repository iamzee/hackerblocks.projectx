import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';

export default Route.extend(ApplicationRouteMixin, {
    session: service(),
    currentUser: service(),
    queryParams: {
        code: {
            refreshModel: true
        }
    },

    sessionAuthenticated () {
      const redirectionPath = localStorage.getItem('redirectionPath')
      if (!isNone(redirectionPath))
        this.transitionTo(redirectionPath)
    },

    async beforeModel (transition) {
      if (!isNone(transition.to.queryParams.code)) {
        if (this.get('session.isAuthenticated')) {
          return this.transitionTo({ queryParams: { code: undefined } })
        }
        // we have ?code qp
        const { code } = transition.to.queryParams
        
        try {
          await this.session.authenticate('authenticator:jwt', { identification: code, password: code, code })
          await this.currentUser.load()
        } catch (error) {
          console.log(error)
          if (error.err === 'USER_EMAIL_NOT_VERIFIED') {
            this.transitionTo('error', {
              queryParams: {
                errorCode: 'USER_EMAIL_NOT_VERIFIED'
              }
            })
          }
        }
      }
    },

    async model () {
      if (this.get('session.isAuthenticated')) {
        return this.currentUser.load()
      }
    },

    setupController(controller, model){
      this._super(controller, model)
      controller.set('model', model)
    }
})

import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class Content extends Route {
  model(params) {    
    const { contest } = this.modelFor('contests.contest')
    const content = this.store.queryRecord('content', {      
      custom: {
        ext: 'url',
        url: `${params.content_id}`
      },
      contest_id: contest.id,
      include: 'problem,quiz'
    })    
    return hash({
      content,
      contest
    })
  }

  afterModel(model) {
    switch(model.content.type) {
      case 'problem': 
        this.transitionTo('contests.contest.content.problem')
        break
      case 'quiz':
        this.transitionTo('contests.contest.content.quiz')
        break
    }
  }

  setupController(controller, model) {
    controller.set('content', model.content)
  }
}
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  email: DS.attr(),
  course: DS.attr(),
  oauth_id: DS.attr(),
  photo: DS.attr()
});

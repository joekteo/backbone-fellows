// $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
//  options.url = '//backbonejs-beginner.herokuapp.com' + options.url;
// });
// $.fn.serializeObject = function() {
//   var o = {};
//   var a = this.serializeArray();
//   $.each(a, function() {
//       if (o[this.name] !== undefined) {
//           if (!o[this.name].push) {
//               o[this.name] = [o[this.name]];
//           }
//           o[this.name].push(this.value || '');
//       } else {
//           o[this.name] = this.value || '';
//       }
//   });
//   return o;
// };

// var Users = Backbone.Collection.extend({
//   url: '/users'
// });

// var User = Backbone.Model.extend({
//   urlRoot: '/users'
// });

// var UserList = Backbone.View.extend({
//   el: '.page',
//   render: function () {
//     var that = this;
//     var users = new Users();
//     users.fetch({
//       success: function (users) {
//         var template = _.template($('#user-list-template').html(), {users: users.models});
//         that.$el.html(template);
//       }
//     })
//   }
// });

// var EditUser = Backbone.View.extend({
//   el: '.page',
//   render: function (options) {
//     var that = this;
//     if (options.id) {
//       that.user = new User({id: options.id});
//       that.user.fetch({
//         success: function (user) {
//           var template = _.template($('#edit-user-template').html(), {user: user});
//           that.$el.html(template);
//         }  
//       })
//     } else {
//       var template = _.template($('#edit-user-template').html(), {user: null});
//       this.$el.html(template);
//     }
//   },  
//   events: {
//     'submit .edit-user-form': 'saveUser',
//     'click .delete': 'deleteUser' 
//   },
//   saveUser: function (ev) {
//     var userDetails = $(ev.currentTarget).serializeObject();
//     var user = new User();
//     user.save(userDetails, {
//       success: function (user){
//         router.navigate('',{trigger: true});
//       }
//     }) 
//     return false;
//   },
//   deleteUser: function (ev) {
//     this.user.destroy({
//       success: function () {
//         router.navigate('', {trigger: true});
//       }
//     })
//     return false;
//   }
// })

// var Router = Backbone.Router.extend({
//   routes: {
//     '': 'home',
//     'new': 'editUser',
//     'edit/:id': 'editUser'
//   }
// });

// var userList = new UserList();

// var editUser = new EditUser();

// var router = new Router();

// router.on('route:home', function () {
//   userList.render();
// });  
// router.on('route:editUser', function (id) {
//   editUser.render({id: id});
// });

// Backbone.history.start();

$(function() {
  var User = Backbone.Model.extend({
    url: '/user',
    idAttribute: '_id',
      defaults: {
        firstname: '',
        lastname: '',
        email: ''
      }
  });

  var UserItemView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#userItemTemplate').html()),
    events: {
      'click .edit': 'editUser',
      'click .delete': 'deleteUser'
    },

    editUser: function () {
      var user = prompt('Enter new name', this.model.get('user'));
      if (!user) return;
      this.model.set('user', user);
    },
    
    initialize: function(){
          this.model.on('change', this.render, this);
    },

    deleteUser: function () {
      this.model.destroy();
    },

    remove: function () {
      this.$el.remove();
    },

    initialize: function () {
      var that = this;
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
        this.render();
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
    }
  });

  var UserCollection = Backbone.Collection.extend({
      model: User,
  });

  var NewUserView = Backbone.View.extend({
    el: '#newUser',
    events: {
      'submit': 'newUser'
    },

    newUser: function (event) {
      event.preventDefault();
      var users = new User({
          'firstname': this.$el.find('.firstname').val(),
          'lastname': this.$el.find('.lastname').val(),
          'email': this.$el.find('.email').val(),
      });

      this.collection.add(users);
    }
  });

  var InpuBoxView = Backbone.View.extend({
    tagName: 'div',
    initialize: function () {
      this.collection.on('add', this.addOne, this);
    },
    addOne: function (user) {
      var userView = new UserItemView({ model: user });
      console.log(userView);
      this.$el.append(userView.el);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'view/:id': 'view',
      'edit': 'edit',
      'tweet': 'showTweet',
      '*default': 'index'
    },

    showTweet: function () {
      console.log('Showing tweets');
        var customerCol = new CustomerCollection();
        customerCol.fetch();
        new CustomerView({ collection: customerCol });
        console.log(customerCol);
      },

      view: function (id) {
        console.log('Viewin item ', id);
        var m1 = new User();
        m1.save();
        m1.sync(function (method, model) {
            console.log('Synced', method, model);
        });
      },

      edit: function () {
        console.log('Edit route added');
      },

      index: function () {
        console.log('Index route added');
        var user = new UserCollection([
          { firstname: 'Paul', lastname: ' George', email: 'paulgeorge@demo.com' },
        ]);
        
        new NewUserView({ collection: user });
        var inputBox = new InpuBoxView({ collection: user });
        $('#page').html(inputBox.render().el);
      }
  });
 
    new AppRouter();
    Backbone.history.start(); 
});

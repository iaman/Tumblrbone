$(function() {

  Tumblrbone = {
    blog: $("#tumblrbone").data("blog"),
    api: $("#tumblrbone").data("api"),
  };

  window.Post = Backbone.Model.extend({
  });

  window.PostList = Backbone.Collection.extend({
    model: Post
  });

  window.PostView = Backbone.View.extend({

    tagName: "article",
    events: {
      "click .like"   : "toggleLike",
      "click .reblog" : "reblog",
      "click .notes"  : "toggleNotes"
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      $(this.el).html(Mustache.render(Mustaches[this.model.toJSON().type + "Post"], this.model.toJSON()));
      return this;
    },

    toggleLike: function() {
      this.model.toggleLike();
    },

    reblog: function() {
      this.model.reblog();
    },

    toggleNotes: function() {
      this.model.toggleNotes();
    }
  });

  window.AppView = Backbone.View.extend({

    el: "#tumblrbone",

    models: [],

    initialize: function() {
      this.collection.bind("add", this.add);
      this.render();
    },

    add: function(model) {
      model.view = new PostView({model: model});
      $(Tumblrbone.view.el).append(model.view.render().el);
    },

    render: function() {
      return this;
    }
  });

  $.ajax({
    url: "http://api.tumblr.com/v2/blog/" + Tumblrbone.blog + "/posts/json?api_key=" + Tumblrbone.api,
    dataType: "jsonp",
    jsonp: "jsonp",
    success: function(data, status) {
      Tumblrbone.posts = new PostList();
      Tumblrbone.view = new AppView({collection: Tumblrbone.posts});
      Tumblrbone.posts.add(data.response.posts);
    }
  });
});

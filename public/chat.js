// Contenedor del chat
var ChatBox = React.createClass({displayName: "ChatBox",

  render: function () {
    return (
      React.createElement("div", {className: "chat-box"}, 
        React.createElement("h1", {className: "title"}, "Chat con ReactJS"), 
        React.createElement(MessageList, {messageList: this.state.messageList}), 
        React.createElement(ChatForm, {onMessageSubmit: this.handleMessageSubmit})
      )
    );
  },

  getInitialState: function () {
    return {
      messageList: [],
    }
  },

  handleMessageSubmit: function (message) {
    socket.emit('message', message);
    this.addNewMessage(message);
  },

  componentDidMount: function () {
    socket.once('messages', function (messages) {
      this.setState({ messageList: messages });
    }.bind(this));

    socket.on('message', function (message) {
      this.addNewMessage(message);
    }.bind(this));
  },

  addNewMessage: function (message) {
    var messageList = this.state.messageList;
    if (messageList.length > 100) {
      messageList.shift();
    }
    messageList.push(message);
    this.setState({ messageList: messageList });
  },

});

// Formulario para enviar mensajes
var ChatForm = React.createClass({displayName: "ChatForm",

  render: function () {
    return (
      React.createElement("form", {className: "chat-form", onSubmit: this.handleSubmit}, 
        React.createElement("input", {className: "input username-input", type: "text", placeholder: "Nombre de usuario", ref: "username"}), 
        React.createElement("input", {className: "input body-input", type: "text", placeholder: "¡Escribe algo! :D", ref: "body"}), 
        React.createElement("button", {className: "button"}, "Enviar")
      )
    );
  },

  handleSubmit: function (event) {
    event.preventDefault();

    var message = {
      username: React.findDOMNode(this.refs.username).value.trim(),
      body: React.findDOMNode(this.refs.body).value.trim(),
    }

    if (!message.username || !message.body) {
      return;
    }

    this.props.onMessageSubmit(message);
    React.findDOMNode(this.refs.body).value = '';
  },

});

// Listado de mensajes
var MessageList = React.createClass({displayName: "MessageList",

  render: function () {
    var messageList = this.props.messageList.map(function (message) {
      return (
        React.createElement(Message, {name: message.username, time: message.time}, message.body)
      );
    });

    return (
      React.createElement("ul", {className: "message-list"}, 
        messageList
      )
    );
  },

});

// Cada mensaje individual
var Message = React.createClass({displayName: "Message",

  componentDidMount: function () {
    this.getDOMNode().scrollIntoView();
  },

  render: function () {
    return (
      React.createElement("li", {className: "message"}, React.createElement("strong", null, this.props.name, ":"), " ", this.props.children, " ", React.createElement(TimeAgo, {delay: "500"}, this.props.time))
    );
  },

});

// Mixin para eliminar un setInterval cuando el elemento se borra
var SetIntervalMixin = {

  componentWillMount: function() {
    this.intervals = [];
  },

  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },

  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  },

};

// ¿Hace cuanto se envió el mensaje?
var TimeAgo = React.createClass({displayName: "TimeAgo",

  mixins: [SetIntervalMixin],

  render: function () {
    return (
      React.createElement("small", {className: "time-ago"}, this.state.time)
    );
  },

  componentDidMount: function () {
    this.setInterval(this.updateTime, this.props.delay);
  },

  getInitialState: function () {
    return { time: moment(this.props.children).fromNow() };
  },

  updateTime: function () {
    this.setState({ time: moment(this.props.children).fromNow() });
  },

});


// Iniciar chat
React.render(React.createElement(ChatBox, null), document.getElementById('chat'));

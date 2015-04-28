// Contenedor del chat
var ChatBox = React.createClass({

  render: function () {
    return (
      <div className="chat-box">
        <h1 className="title">Chat con ReactJS</h1>
        <MessageList messageList={this.state.messageList} />
        <ChatForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
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
var ChatForm = React.createClass({

  render: function () {
    return (
      <form className="chat-form" onSubmit={this.handleSubmit}>
        <input className="input username-input" type="text" placeholder="Nombre de usuario" ref="username" />
        <input className="input body-input" type="text" placeholder="¡Escribe algo! :D" ref="body" />
        <button className="button">Enviar</button>
      </form>
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
var MessageList = React.createClass({

  render: function () {
    var messageList = this.props.messageList.map(function (message) {
      return (
        <Message name={message.username} time={message.time}>{message.body}</Message>
      );
    });

    return (
      <ul className="message-list">
        {messageList}
      </ul>
    );
  },

});

// Cada mensaje individual
var Message = React.createClass({

  componentDidMount: function () {
    this.getDOMNode().scrollIntoView();
  },

  render: function () {
    return (
      <li className="message"><strong>{this.props.name}:</strong> {this.props.children} <TimeAgo delay="500">{this.props.time}</TimeAgo></li>
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
var TimeAgo = React.createClass({

  mixins: [SetIntervalMixin],

  render: function () {
    return (
      <small className="time-ago">{this.state.time}</small>
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
React.render(<ChatBox />, document.getElementById('chat'));

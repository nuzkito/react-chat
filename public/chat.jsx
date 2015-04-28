// Contenedor del chat
var ChatBox = React.createClass({

  render: function () {

    var messageList = [
      {
        id: 1,
        username: 'Usuario',
        body: 'Contenido del mensaje',
        time: new Date(),
      },
      {
        id: 2,
        username: 'Usuario',
        body: 'Contenido del mensaje',
        time: new Date(),
      },
      {
        id: 3,
        username: 'Usuario',
        body: 'Contenido del mensaje',
        time: new Date(),
      },
    ];

    return (
      <div className="chat-box">
        <h1 className="title">Chat con ReactJS</h1>
        <MessageList messageList={messageList} />
        <ChatForm />
      </div>
    );
  },

});

// Formulario para enviar mensajes
var ChatForm = React.createClass({

  render: function () {
    return (
      <form className="chat-form">
        <input className="input username-input" type="text" placeholder="Nombre de usuario" />
        <input className="input body-input" type="text" placeholder="¡Escribe algo! :D" />
        <button className="button">Enviar</button>
      </form>
    );
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

  render: function () {
    return (
      <li className="message"><strong>{this.props.name}:</strong> {this.props.children} <TimeAgo>{this.props.time}</TimeAgo></li>
    );
  },

});

// ¿Hace cuanto se envió el mensaje?
var TimeAgo = React.createClass({

  render: function () {
    return (
      <small className="time-ago">{moment(this.props.children).fromNow()}</small>
    );
  }

});


// Iniciar chat
React.render(<ChatBox />, document.getElementById('chat'));

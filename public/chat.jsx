// Contenedor del chat
var ChatBox = React.createClass({

  render: function () {
    return (
      <div className="chat-box">
        <h1 className="title">Chat con ReactJS</h1>
        <MessageList />
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
    return (
      <ul className="message-list">
        <Message />
        <Message />
        <Message />
      </ul>
    );
  },

});

// Cada mensaje individual
var Message = React.createClass({

  render: function () {
    return (
      <li className="message"><strong>Usuario:</strong> Mensaje <TimeAgo>hace dos minutos</TimeAgo></li>
    );
  },

});

// ¿Hace cuanto se envió el mensaje?
var TimeAgo = React.createClass({

  render: function () {
    return (
      <small className="time-ago">hace dos minutos</small>
    );
  }

});


// Iniciar chat
React.render(<ChatBox />, document.getElementById('chat'));

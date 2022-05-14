<template>
  <ion-page>

<!--    <ion-header>-->
<!--      <ion-toolbar>-->
<!--        <ion-buttons slot="start">-->
<!--          <ion-menu-button></ion-menu-button>-->
<!--        </ion-buttons>-->
<!--        <ion-title>Chatter</ion-title>-->
<!--      </ion-toolbar>-->
<!--    </ion-header>-->

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Chatter</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row v-for="(message, index) in messages" :key="index">

          <ion-col size="9" v-if="message.from !== myUserID" class="message" :class="{'my_message': message.from === myUserID, 'other_message': message.from !== myUserID}">
            <span class="user_name">{{ message.from }}:</span><br>
            <span>{{ message.text }}</span>
            <div class="time">{{ message.created }}</div>
          </ion-col>

          <ion-col offset="3" size="9" v-if="message.from === myUserID" class="message" :class="{'my_message': message.from === myUserID, 'other_message': message.from !== myUserID}">
            <span class="user_name">{{ message.from }}:</span><br>
            <span>{{ message.text }}</span>
            <div class="time">{{ message.created }}</div>
          </ion-col>

        </ion-row>
      </ion-grid>

<!--      <div class="container1">-->
<!--        <div class="container2">-->
<!--          <div class="container">-->
<!--        <div class="chatbox">-->
<!--          <div class="top-bar">-->
<!--            <div class="avatar"><p>V</p></div>-->
<!--            <div class="name">Voldemort</div>-->
<!--            <div class="icons">-->
<!--              <i class="fas fa-phone"></i>-->
<!--              <i class="fas fa-video"></i>-->
<!--            </div>-->
<!--            <div class="menu">-->
<!--              <div class="dots"></div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="middle">-->
<!--            <div class="voldemort">-->
<!--              <div class="incoming">-->
<!--                <div class="bubble">Hey, Father's Day is coming up..</div>-->
<!--                <div class="bubble">What are you getting.. Oh, oops sorry dude.</div>-->
<!--              </div>-->
<!--              <div class="outgoing">-->
<!--                <div class="bubble lower">Nah, it's cool.</div>-->
<!--                <div class="bubble">Well you should get your Dad a cologne. Here smell it. Oh wait! ...</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="bottom-bar">-->
<!--              <div class="typing">-->
<!--                <div class="bubble">-->
<!--                  <div class="ellipsis one"></div>-->
<!--                  <div class="ellipsis two"></div>-->
<!--                  <div class="ellipsis three"></div>-->
<!--                </div>-->
<!--              </div>-->
<!--            <div class="chat">-->
<!--              <input type="text" placeholder="Type a message..." />-->
<!--              <button type="submit"><i class="fas fa-paper-plane"></i></button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--&lt;!&ndash;        <div class="profile">&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="avatar"><p>H</p></div>&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="nameBold">Harry<p class="email">Harry@potter.com</p></div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <ul class="people">&ndash;&gt;-->
<!--&lt;!&ndash;          <li class="person focus">&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="title">Voldemort </span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="time">2:50pm</span><br>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="preview">What are you getting... Oh, oops...</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </li>&ndash;&gt;-->
<!--&lt;!&ndash;          <li class="person">&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="title">Ron</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="time">2:25pm</span><br>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="preview">Meet me at Hogsmeade and bring...</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </li>&ndash;&gt;-->
<!--&lt;!&ndash;          <li class="person">&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="title">Hermione</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="time">2:12pm</span><br>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="preview">Have you and Ron done your hom...</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </li>&ndash;&gt;-->
<!--&lt;!&ndash;        </ul>&ndash;&gt;-->
<!--      </div>-->
<!--        </div>-->
<!--      </div>-->

    </ion-content>

<!--    <ion-footer>-->
<!--      <ion-toolbar>-->
<!--        <ion-row class="message_row">-->
<!--          <ion-col size="9">-->
<!--            <ion-item no-lines>-->
<!--              <ion-input type="text" placeholder="Message" v-model="newMessage"></ion-input>-->
<!--            </ion-item>-->
<!--          </ion-col>-->
<!--          <ion-col size="3">-->
<!--            <button ion-button clear color="primary" @click="send" :disabled="newMessage === ''">-->
<!--              Send-->
<!--            </button>-->
<!--          </ion-col>-->
<!--        </ion-row>-->
<!--      </ion-toolbar>-->
<!--    </ion-footer>-->
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonHeader,
  IonContent,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonInput,
  IonItem,
  menuController
} from '@ionic/vue';
import {reactive, ref, watch} from "vue";
import SocketIOService from '../../services/socketio.service';

export default  {
  name: `chat22.vue`,
  components: { IonPage, IonHeader, IonContent, IonFooter, IonToolbar, IonTitle, IonLabel, IonInput, IonItem },
  setup: function () {
    let newMessage = ref(null);
    let typing = ref(false);
    let ready = ref(false);
    let info = reactive([]);
    let connections = ref(0);
    const messages = reactive([
      {
        from: 2,
        to: 1,
        text: "Test 1",
        created: new Date(),
      },
      {
        from: 1,
        to: 2,
        text: "Test 2",
        created: new Date(),
      },
      {
        from: 2,
        to: 1,
        text: "Test 1",
        created: new Date(),
      },
      {
        from: 1,
        to: 2,
        text: "Test 2",
        created: new Date(),
      },
    ]);
    const username = ref(null);
    SocketIOService.socket.emit()

    window.onbeforeunload = () => {
      SocketIOService.socket.emit("leave", username.value);
    };

    SocketIOService.socket.on("chat-message", (data) => {
      messages.push({
        message: data.message,
        type: 1,
        user: data.user,
      });
    });

    SocketIOService.socket.on("typing", (data) => {
      typing.value = data;
    });

    SocketIOService.socket.on("stopTyping", () => {
      typing.value = false;
    });

    SocketIOService.socket.on("joined", (data) => {
      info.push({
        username: data.name,
        type: "joined",
      });

      messages.push(...data.messages);

      setTimeout(() => {
        info.length = 0;
      }, 5000);
    });

    SocketIOService.socket.on("leave", (data) => {
      info.push({
        username: data,
        type: "left",
      });

      setTimeout(() => {
        info.length = 0;
      }, 5000);
    });

    SocketIOService.socket.on("connections", (data) => {
      connections.value = data;
    });

    watch(newMessage, (newMessage, preNewMessage) => {
      newMessage
          ? SocketIOService.socket.emit("typing", username.value)
          : SocketIOService.socket.emit("stopTyping");
    });

    function send() {
      messages.push({
        message: newMessage.value,
        type: 0,
        user: "Me",
      });

      SocketIOService.socket.emit("chat-message", {
        message: newMessage.value,
        user: username.value,
      });
      newMessage.value = null;
    }

    function addUser() {
      ready.value = true;
      SocketIOService.socket.emit("joined", username.value);
    }

    return {
      addUser,
      send,
      newMessage,
      messages,
      typing,
      username,
      ready,
      info,
      connections,
    };
  },
  data() {
    return {
      myUserID: 1,
    }
  },
  methods: {
    // this.getMessages().subscribe(message => {
    //   this.messages.push(message);
    // });
    //
    // this.getUsers().subscribe(data => {
    //   let user = data['user'];
    //   if (data['event'] === 'left') {
    //     this.showToast('User left: ' + user);
    //   } else {
    //     this.showToast('User joined: ' + user);
    //   }
    // });
    //
    // sendMessage() {
    //   this.socket.emit('add-message', { text: this.message });
    //   this.message = '';
    // },
    //
    // getMessages() {
    //   let observable = new Observable(observer => {
    //     this.socket.on('message', (data) => {
    //       observer.next(data);
    //     });
    //   })
    //   return observable;
    // },
    //
    // getUsers() {
    //   let observable = new Observable(observer => {
    //     this.socket.on('user-changed', (data) => {
    //       observer.next(data);
    //     });
    //   });
    //   return observable;
    // },
    //
    // ionViewWillLeave() {
    //   this.socket.disconnect();
    // },
    //
    // showToast(msg) {
    //   let toast = this.toastCtrl.create({
    //     message: msg,
    //     duration: 2000
    //   });
    //   toast.present();
    // }
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
//#container {
//  text-align: center;
//  position: absolute;
//  left: 0;
//  right: 0;
//  top: 50%;
//  transform: translateY(-50%);
//}



/**/

@import url('https://fonts.googleapis.com/css?family=Lato:400,700');

$font: 'Lato', sans-serif;

$primary: #79C7C5;
$secondary: #A1E2D9;
$white: #F9FBFF;
$dark: #777777;

.container1 {
  display: grid;
  min-height: 100%;
}

.container2 {
  display: grid;
  background: linear-gradient(to bottom left, $primary 40%, $white 100%);
  font-family: $font;
}

.container {
  position: relative;
  margin: auto;
  width: 100%;
  height: 100%;
}

.messages {
  position: absolute;
  background: $white;
  opacity: 0.5;
  width: 30%;
  height: 70%;
  top: 2.5%;
  left: 5%;
  border-radius: 10px 0 0 10px;
  box-shadow: -5px 5px 10px rgba($dark, .5);
}

/*chat messages */
.people {
  position: absolute;
  list-style-type: none;
  width: 30.2%;
  left: -10px;
  top: 24.7%;
  line-height: 0.7em;
  .title {
    text-transform: uppercase;
    font-size: 0.7em;
    margin-left: 14px;
    letter-spacing: 1px;
    color: $dark;
  }
  .time {
    font-size: 0.3em;
    color: $dark;
    position: absolute;
    right: 10px;
    margin-top: 2px;
  }
  .preview {
    color: $primary;
    margin-left: 14px;
    font-size: 0.5em;
  }
}

.person {
  padding: 12px 0 12px 12px;
  border-bottom: 1px solid $primary;
  cursor: pointer;
  &:hover {
    background: $white;
    transition: all .3s ease-in-out;
  }
}

.focus {
  background: $white;
  margin-left: 1px;
}

.profile {
  position: absolute;
  left: 16%;
  top: 7%;
}

.nameBold{
  position: absolute;
  top: 50px;
  left: 2px;
  text-transform: uppercase;
  color: $primary;
  font-size: .8em;
  letter-spacing: 2px;
  font-weight: 500;
}
.email {
  color: $white;
  font-size: .5em;
  margin-left: -30px;
  margin-top: 2px;
}

//.chatbox {
//  position: absolute;
//  left: 35%;
//  height: 75%;
//  width: 60%;
//  border-radius: 10px;
//  box-shadow: 5px 5px 15px rgba($dark, 0.5);
//}

.chatbox {
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  box-shadow: 5px 5px 15px rgba($dark, 0.5);
}

.top-bar {
  width: 100%;
  height: 60px;
  background: $white;
  border-radius: 10px 10px 0 0;
}

.avatar {
  width: 35px;
  height: 35px;
  background: linear-gradient(to bottom left, $primary 20%, $secondary 100%);
  border-radius: 50%;
  position: absolute;
  top: 11px;
  left: 15px;
  p {
    color: $white;
    margin: 7px 12px;
  }
}

.name {
  position: absolute;
  top: 22px;
  text-transform: uppercase;
  color: $dark;
  font-size: .8em;
  letter-spacing: 2px;
  font-weight: 500;
  left: 60px;
}

.menu {
  position: absolute;
  right: 10px;
  top: 20px;
  width: 10px;
  height: 20px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    transition: all .3s ease-in;
  }
}

.icons {
  position: absolute;
  color: $secondary;
  padding: 10px;
  top: 5px;
  right: 21px;
  cursor: pointer;
  .fas {
    padding: 5px;
    opacity: 0.8;
    &:hover {
      transform: scale(1.1);
      transition: all .3s ease-in;
    }
  }
}

.dots {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: $primary;
  box-shadow: 0px 7px 0px $primary, 0px 14px 0px $primary;
}

.middle {
  position: absolute;
  background: $white;
  width: 100%;
  opacity: 0.85;
  top: 60px;
  height: calc(100% - 7.2rem);
}

.incoming {
  position: absolute;
  width: 50%;
  height: 100%;
  padding: 20px;
  .bubble {
    background: lighten($dark, 23%);
  }
}

.typing {
  border: 1px solid red;
  position: absolute;
  bottom: 5em;
  left: 20px;
  .bubble {
    background: lighten($dark, 45%);
    padding: 8px 13px 9px 13px;
  }
}


.ellipsis {
  width: 5px;
  height: 5px;
  display: inline-block;
  background: lighten($dark, 25%);
  border-radius: 50%;
  animation: bounce 1.3s linear infinite;
}

.one {
  animation-delay: 0.6s;
}
.two {
  animation-delay: 0.5s;
}
.three {
  animation-delay: 0.8s;
}

.bubble {
  position: relative;
  display: inline-block;
  margin-bottom: 5px;
  color: $white;
  font-size: 0.7em;
  padding: 10px 10px 10px 12px;
  border-radius: 20px;
}

.lower {
  margin-top: 45px;
}

.outgoing {
  position: absolute;
  padding: 20px;
  right: 0;
  top: 15%;
  width: 50%;
  height: 100%;
  .bubble {
    background: $primary;
    float: right;
  }
}


.bottom-bar {
  position: absolute;
  width: 100%;
  height: 55px;
  bottom: 0;
  background: $white;
  border-radius: 0 0 10px 10px;
}

.left {
  left: 0px;
}

input {
  padding: 7px;
  width: 74%;
  left: 5%;
  position: absolute;
  border: 0;
  top: 13px;
  background: $white;
  color: $primary;

}

input::placeholder {
  color: $secondary;
}

input:focus {
  color: $dark;
  outline: 0;
}

button {
  position: absolute;
  border: 0;
  font-size: 1em;
  color: $secondary;
  top:  19px;
  opacity: 0.8;
  right: 17px;
  cursor: pointer;
  outline: 0;
  &:hover {
    transform: scale(1.1);
    transition: all .3s ease-in-out;
    color: $primary;
  }
}



footer {
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
  font-size: 0.7em;
  padding: 10px;
  p {
    color: $primary;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  a {
    color: $white;
    text-decoration: none;
    &:hover {
      color: $secondary;
    }
  }
}


@keyframes bounce {
  30% { transform: translateY(-2px); }
  60% { transform: translateY(0px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0px); opacity: 0.5;  }
}

</style>
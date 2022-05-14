<template>
  <ion-page  class="ion-page" id="common">
    <ion-content :fullscreen="true" class="container">

      <div class="chat" id="chat">
        <div class="chat-title">
          <h1>{{ partner.name || 'Anonymous'}}</h1>
          <h2>{{ isPartnerTyping ? 'typing...' : partner.status || ''}}</h2>
          <figure class="bars" @click="openMenu">
            <fa icon="bars" type="fab" class="icon"></fa>
          </figure>
          <figure class="avatar">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" />
          </figure>
        </div>
        <div class="messages">
          <div class="messages-content">

            <ion-grid>
              <ion-row v-for="(message, index) in messages" :key="message.from">

                <ion-col v-if="message.from !== user.id" class="message new" size="9" :key="index">
                  <figure class="avatar">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" />
                  </figure>
                  <span class="user_name bold">{{ partner.name }}</span><br>
                  <span v-html="textFilter(message.text || '')"></span>
                  <div class="time text-left">{{ timeFilter(message.sent_at) }}</div>
                </ion-col>

                <ion-col v-if="message.from === user.id" :class="{'faded': message.uuid}" class="message message-personal" size="9" offset="3">
                  <span class="user_name bold">{{ user.name }}</span><br>
                  <span v-html="textFilter(message.text || '')"></span>
                  <div class="time text-right">
                    {{ message.uuid ? 'sending' : timeFilter(message.sent_at) }}&nbsp;
                    <fa v-if="message.delivered_at" icon="check-double" type="fab" class="icon" :color="message.read_at !== null ? 'cyan' : 'white'"></fa>
                    <fa v-else icon="check" type="fab" class="icon" color="white"></fa>
                  </div>
                </ion-col>

              </ion-row>

              <ion-row>

                <ion-col v-if="newMessage.length" class="message message-personal faded" size="9" offset="3">
                  <span class="user_name bold">Me</span><br>
                  <span v-html="textFilter(newMessage)"></span>
                  <div class="time align-right">to be send</div>
                </ion-col>

              </ion-row>

              <ion-row>
                <span>
                  <div class="message loading new" v-show="isPartnerTyping">
                    <figure class="avatar">
                      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" />
                    </figure>
                    <span></span>
                  </div>
                </span>
              </ion-row>

              <ion-row>
                <div  id="new-message"></div>
              </ion-row>

            </ion-grid>
          </div>
        </div>
        <div class="message-box">
          <ion-textarea v-model="newMessage"
                        mode="md"
                        autofocus="true"
                        class="message-input"
                        placeholder="Type message . . ."
                        spellcheck="true"></ion-textarea>
          <ion-button @click="findPartner"
                      mode="md"
                      type="submit"
                      size="small"
                      shape="round"
                      color="light"
                      class="find-button icon-button">
            <fa icon="search" type="fab" class="icon"></fa></ion-button>
          <ion-button v-if="newMessage.trim().length === 0" @click="findPartner"
                      type="submit"
                      size="small"
                      shape="round"
                      color="light"
                      class="attachment-button icon-button">
            <fa icon="paperclip" type="fab" class="icon"></fa></ion-button>
          <ion-button v-else @click="sendMessage"
                      mode="md"
                      type="submit"
                      size="small"
                      shape="round"
                      color="success"
                      class="send-button icon-button">
            <fa icon="paper-plane" type="fab" class="icon"></fa></ion-button>
          <ion-button @click="scrollToNewMessage"
                      mode="md"
                      type="submit"
                      size="small"
                      shape="round"
                      color="success"
                      class="scroll-button icon-button">
            <fa icon="angle-double-down" type="fab" class="icon"></fa></ion-button>
        </div>
      </div>
      <div class="bg"></div>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonHeader,
  IonContent,
  IonFooter,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  IonLabel,
  IonList,
  IonItem,
  IonRadioGroup,
  IonInput,
  IonTextarea,
  IonRadio,
  IonRange,
  IonAvatar,
  IonButton,
  menuController
} from '@ionic/vue';
import { mapGetters, mapActions } from 'vuex';
import moment from "moment";
import {uuidv4} from '../../utils/uuid';

export default {
  name: `chat-vue`,
  inject: ['SocketIOService', 'AxiosService', 'openMenu'],
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonFooter,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonTitle,
    IonLabel,
    IonList,
    IonItem,
    IonRadioGroup,
    IonInput,
    IonTextarea,
    IonRadio,
    IonRange,
    IonAvatar,
    IonButton,
  },
  data() {
    return {
      newMessage: '',
      messages: [],
      isUserTyping: false,
      isPartnerTyping: false,
      ready: false,
      //
      isWindowActive: true,
      scrollOnActive: false,
      partnerLastDeliveredMessageId: -1,
      partnerLastReadMessageId: -1,
    };
  },
  async mounted() {

    // if (this.$route.path.includes('/chat/stranger/')) {
    //   //
    // } else if (this.$route.path.includes('/chat/partner/')) {
    //   //
    // } else {
    //   console.log(this.partner, `/chat/stranger/${this.partner.id}`);
    //   return this.$router.replace(`/chat/stranger/${this.partner.id}`);
    // }

    window.addEventListener("blur", () => {
      this.isWindowActive = false;
    });

    window.addEventListener("focus", () => {
      this.isWindowActive = true;
      if (this.scrollOnActive) {
        this.scrollToNewMessage();
        this.scrollOnActive = false;
      }
    });

    document
        .getElementById("chat")
        .addEventListener("click", () => {
          let index = [...this.messages].reverse().findIndex((message) => message.from === this.partner.id);
          index = index >= 0 ? this.messages.length - 1 - index : index;
          if (!this.messages[index]['seen_at']) {
            if (this.partnerLastReadMessageId !== index) {
              this.partnerLastReadMessageId = index;
              this.SocketIOService.socket.emit("seen-message", {
                message: this.messages[index]
              });
              this.scrollToNewMessage();
            }
          }
        });

    // Update chat and add new messages
    this.SocketIOService.socket.on(`${this.user.id}.new-message`, (data) => {
      const {message} = data;
      if (message.from === this.user.id) {
        for (let i = this.messages.length - 1; i >= 0; i--) {
          if (this.messages[i]['uuid'] === message.id) {
            this.messages.splice(i,1, message);
            break;
          }
        }
      }
      else if (message.from === this.partner.id) {
        this.messages.push(message);
        this.SocketIOService.socket.emit("received-message", {
          message: message
        });
      }
      if (!this.isWindowActive) {
        this.scrollOnActive = true;
      } else {
        this.scrollToNewMessage();
      }
    });

    // Update chat and update messages delivered status
    this.SocketIOService.socket.on(`${this.user.id}.delivered-message`, ({message}) => {
      for (let i = this.messages.length - 1; i >= 0 && i > this.partnerLastDeliveredMessageId; i--) {
        if (this.messages[i]['from'] === message.from && this.messages[i]['delivered_at'] === null) {
          this.messages[i]['delivered_at'] = new Date()
        } else if (this.messages[i]['delivered_at'] !== null) {
          break;
        }
      }
      this.partnerLastDeliveredMessageId = this.messages.length-1;
    });

    // Update chat and update messages read status
    this.SocketIOService.socket.on(`${this.user.id}.read-message`, ({message}) => {
      for (let i = this.messages.length - 1; i >= 0 && i > this.partnerLastReadMessageId; i--) {
        if (this.messages[i]['from'] === message.from && this.messages[i]['read_at'] === null) {
          this.messages[i]['read_at'] = new Date()
        } else if (this.messages[i]['read_at'] !== null) {
          break;
        }
      }
      this.partnerLastReadMessageId = this.messages.length-1;
    });

    this.SocketIOService.socket.on(`${this.user.id}.found`, (data) => {
      const {partner} = data;
      console.log(data)
      this.newMessage = '';
      this.messages = [];
      this.partner = partner;
    });

    this.SocketIOService.socket.on(`${this.partner.id}.${this.user.id}.typing`, () => {
      this.isPartnerTyping = true;
    });

    this.SocketIOService.socket.on(`${this.partner.id}.${this.user.id}.stoppedTyping`, () => {
      this.isPartnerTyping = false;
    });

    // this.SocketIOService.socket.on("joined", (data) => {
    //   console.log(data);
    //   this.info.push({
    //     username: data.name,
    //     type: "joined",
    //   });
    //
    //   this.messages.push(...data.messages);
    //
    //   setTimeout(() => {
    //     this.info.length = 0;
    //   }, 5000);
    // });
    //
    // this.SocketIOService.socket.on("leave", (data) => {
    //   this.info.push({
    //     username: data,
    //     type: "left",
    //   });
    //
    //   setTimeout(() => {
    //     this.info.length = 0;
    //   }, 5000);
    // });

    setTimeout(async () => {
      await this.loadMessages();
    }, 100);
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('partner', ['partner']),
  },
  methods: {
    sendMessage: function () {
      if (this.newMessage.length === 0) return;

      const message = {
        text: this.newMessage,
        from: this.user.id,
        to: this.partner.id,
        created: new Date(),
        uuid: uuidv4(),
      };

      this.newMessage = '';

      this.messages.push(message);

      this.SocketIOService.socket.emit("new-message", {
        message: message,
      });
    },

    findPartner: async function () {
      let response = confirm(`Are you sure?`);
      if (response) {
        await this.$router.replace('/home');
      }
    },

    loadMessages: function () {
      setTimeout(async () => {
        await this.AxiosService.get(`${process.env.VUE_APP_SOCKET_ENDPOINT}/message/user/${this.partner.id}`)
            .then(({data}) => {
              this.messages = data;
              let index = [...this.messages].reverse().findIndex((message) => message.from === this.partner.id);
              index = index >= 0 ? this.messages.length - 1 - index : index;
              this.SocketIOService.socket.emit("received-message", {
                message: this.messages[index]
              });
              this.SocketIOService.socket.emit("seen-message", {
                message: this.messages[index]
              });
              this.scrollToNewMessage();
            })
            .catch((error) => {
              console.error(error);
            })
      }, 100);
    },

    scrollToNewMessage: function (event, element = "new-message") {
      setTimeout(function (element = "new-message") {
        window.document
            .getElementById(element)
            .scrollIntoView({ behavior: "smooth" });
      }, 100, [element]);
    },

    // filters
    timeFilter(value) {
      return moment(value).startOf('seconds').fromNow();
    },
    textFilter: (text) => {
      return text.replace(/\n/gi, '<br>')
    },
  },
  watch: {
    newMessage: function (value) {
      if(value.trim().length > 0) {
        this.SocketIOService.socket.emit(`typing`, {
          event: "typing",
          userId: this.user.id,
          partnerId: this.partner.id,
        })
        this.isUserTyping = true;
        this.scrollToNewMessage();
      } else {
        this.SocketIOService.socket.emit(`stoppedTyping`, {
          event: "stoppedTyping",
          userId: this.user.id,
          partnerId: this.partner.id,
        });
        this.isUserTyping = false;
      }
    },
  }
}

</script>

<style lang="scss">
:root {
  --ion-safe-area-top: 20px;
  --ion-safe-area-bottom: 22px;
}
</style>

<style scoped lang="scss">
.scroller {
  height: 100%;
}

/*--------------------
Mixins
--------------------*/
@mixin center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@mixin ball {
  @include center;
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .5);
  z-index: 2;
  margin-top: 6px;
  animation: ball .45s cubic-bezier(0, 0, 0.15, 1) alternate infinite;
}


/*--------------------
Body
--------------------*/
.container {
  margin: 0;
  padding: 0;
  position: relative;
}


.bg {
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background: #333333 url('../../assets/images/map.jpg') no-repeat 0 0;
  background-size: cover;
  filter: blur(100px);
}


/*--------------------
Chat
--------------------*/
.chat {
  @include center;
  width: 100vw;
  height: 100%;
  z-index: 2;
  overflow: hidden;
  box-shadow: 0 5px 30px rgba(0, 0, 0, .2);
  background: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}


/*--------------------
Chat Title
--------------------*/
.chat-title {
  flex: 0 1 45px;
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: left;
  padding: 10px 10px 10px 90px;

  h1, h2 {
    font-weight: normal;
    font-size: 14px;
    margin: 0;
    padding: 0;
  }

  h2 {
    color: rgba(255, 255, 255, .5);
    font-size: 12px;
    letter-spacing: 1px;
  }

  .avatar {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 48px;
    border-radius: 30px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(255, 255, 255, 0.24);

    img {
      width: 100%;
      height: auto;
    }
  }

  .bars {
    position: absolute;
    z-index: 1;
    top: 12px;
    left: 16px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-size: 20px;

    fa {
      width: 100%;
      height: auto;
    }
  }
}


/*--------------------
Messages
--------------------*/
.messages {
  flex: 1 1 auto;
  color: rgba(255, 255, 255, .5);
  overflow: scroll;
  position: relative;
  width: 100%;

  & .messages-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 101%;
    width: 100%;
  }

  .message {
    clear: both;
    float: left;
    padding: 6px 10px 7px;
    border-radius: 10px 10px 10px 0;
    background: rgba(0, 0, 0, .3);
    font-size: 15px;
    line-height: 1.4;
    margin: 8px 8px 8px 42px;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, .2);

    .bold {
      font-weight: 600;
    }

    .time {
      position: absolute;
      padding: 0 4px;
      bottom: -18px;
      width: 70vw;
      font-size: 12px;
      color: rgba(255, 255, 255, .3);

      &.text-left {
        text-align: left;
      }

      &.text-right {
        text-align: right;
      }
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -6px;
      border-top: 6px solid rgba(0, 0, 0, .3);
      left: 0;
      border-right: 7px solid transparent;
    }

    .avatar {
      position: absolute;
      z-index: 1;
      bottom: -15px;
      left: -35px;
      border-radius: 30px;
      width: 30px;
      height: 30px;
      overflow: hidden;
      margin: 0;
      padding: 0;
      border: 2px solid rgba(255, 255, 255, 0.24);

      img {
        width: 100%;
        height: auto;
      }
    }

    &.message-personal {
      float: right;
      color: #fff;
      text-align: left;
      background: linear-gradient(120deg, #248A52, #257287);
      border-radius: 10px 10px 0 10px;

      &::before {
        left: auto;
        right: 0;
        border-right: none;
        border-left: 5px solid transparent;
        border-top: 4px solid #257287;
        bottom: -4px;
      }
    }

    &.faded {
      opacity: 0.5;
    }

    &:last-child {
      margin-bottom: 30px;
    }

    &.new {
      transform: scale(0);
      transform-origin: 0 0;
      animation: bounce 500ms linear both;
    }

    &.loading {

      &::before {
        @include ball;
        border: none;
        animation-delay: .15s;
      }

      & span {
        display: block;
        font-size: 0;
        width: 28px;
        height: 20px;
        position: relative;

        &::before {
          @include ball;
          margin-left: -8px;
        }

        &::after {
          @include ball;
          margin-left: 8px;
          animation-delay: .3s;
        }
      }
    }

  }
}


/*--------------------
Message Box
--------------------*/
.message-box {
  flex: 0 1 40px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  position: relative;

  & .icon-button {
    height: 36px !important;
    width: 36px !important;
    font-size: 20px;
    position: absolute;
    z-index: 1;
    line-height: 1;
    top: 6px;
    border: none;
    border-radius: 10px;
  }

  & .find-button {
    left: 10px;
    color: #fff;
  }

  & .attachment-button {
    right: 10px;
    color: #fff;
  }

  & .send-button {
    right: 10px;
    color: #fff;
  }

  & .scroll-button {
    top: -64px;
    right: 10px;
    color: #fff;
  }

  & .message-input {
    left: 50px;
    background: none;
    border: none;
    outline: none!important;
    resize: none;
    color: rgba(255, 255, 255, .7);
    font-size: 16px;
    height: 48px;
    width: calc(100% - 100px);
    margin: 0;
    padding: 0;
    overflow-y: scroll;
  }

  & .message-input::-webkit-scrollbar {
    display: none;
  }

  & .message-input:focus:-webkit-placeholder{
    color: transparent;
  }
}


/*--------------------
Custom Srollbar
--------------------*/
.mCSB_scrollTools {
  margin: 1px -3px 1px 0;
  opacity: 0;
}

.mCSB_inside > .mCSB_container {
  margin-right: 0px;
  padding: 0 10px;
}

.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
  background-color: rgba(0, 0, 0, 0.5)!important;
}


/*--------------------
Bounce
--------------------*/
@keyframes bounce {
  0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
}


@keyframes ball {
  from {
    transform: translateY(0) scaleY(.8);
  }
  to {
    transform: translateY(-10px);
  }
}

</style>

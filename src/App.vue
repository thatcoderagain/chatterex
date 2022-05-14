<template>
  <ion-app>

    <ion-menu side="start" menu-id="menu-home" content-id="common" swipe-gesture="false">
      <ion-header>
        <ion-toolbar translucent>
          <ion-title>Chatter</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="chat-title">
          <h1>{{ this.user ? this.user.name : 'Anonymous'}}</h1>
          <h2>{{ this.user ? this.user.sex + ' ' + this.user.age : ''}}</h2>
          <figure class="avatar">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKjOxL6Y1VypLaaB3nx6JYGGH1pf0i_NrhZQ&usqp=CAU" />
          </figure>
        </div>
        <ion-list>
          <ion-item @click="navigateTo('/home')">
            <fa icon="user-secret" type="fab" class="icon" slot="start"></fa>
            <ion-label>Find Partner</ion-label>
          </ion-item>
          <ion-item @click="navigateTo('/friends')">
            <fa icon="user-friends" type="fab" class="icon" slot="start"></fa>
            <ion-label>Friends</ion-label>
          </ion-item>
          <ion-item @click="navigateTo('/profile')">
            <fa icon="user-cog" type="fab" class="icon" slot="start"></fa>
            <ion-label>Profile</ion-label>
          </ion-item>
          <ion-item @click="navigateTo('/settings')">
            <fa icon="cog" type="fab" class="icon" slot="start"></fa>
            <ion-label>Settings</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-router-outlet id="menu"/>

  </ion-app>
</template>

<script>
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  menuController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import SocketIOService from './services/socketio.service';
import AxiosService from './services/axios.service';

export default defineComponent({
  name: 'App',
  provide() {
    return {
      SocketIOService: this.SocketIOService,
      AxiosService: this.AxiosService,
      openMenu: this.openMenu,
    }
  },
  components: {
    IonApp,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonMenu,
    IonRouterOutlet,
    IonTitle,
    IonToolbar
  },
  data() {
    return {
      SocketIOService: SocketIOService,
      AxiosService: AxiosService,
    }
  },
  async created() {
    // if user not registered
    if (!this.user) {
      await this.AxiosService.put(process.env.VUE_APP_SOCKET_ENDPOINT + '/user')
          .then(async ({data}) => {
            await this.updateUser({
              id: data.id,
              name: data.name,
              sex: data.sex,
              age: data.age,
            });
            await this.SocketIOService.join(data);
            this.AxiosService.setAuthorizationHeader(`Bearer ${data.id}`);
          })
          .catch((error) => {
            console.error(error.response.message);
          });
    }
    // if user already registered
    else {
      await this.AxiosService.get(`${process.env.VUE_APP_SOCKET_ENDPOINT}/user/${this.user.id}`)
          .then(async ({data}) => {
            await this.updateUser({
              id: data.id,
              name: data.name,
              sex: data.sex,
              age: data.age,
            });
            await this.SocketIOService.join(data);
            this.AxiosService.setAuthorizationHeader(`Bearer ${data.id}`);
          })
          .catch((error) => {
            console.error(error.response.message);
          });
    }
  },
  mounted() {

  },
  beforeUnmount() {
    this.SocketIOService.disconnect();
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('user', ['updateUser', 'updateUserName']),
    openMenu: async function () {
      await menuController.open();
    },

    navigateTo: async function(path) {
      await menuController.isOpen().then(() => {
        menuController.close();
      })
      .finally(async () => {
        await this.$router.replace(path);
      })
    }
  },
});
</script>

<style lang="scss" scoped>


/*--------------------
Chat Title
--------------------*/
.chat-title {
  flex: 0 1 45px;
  position: relative;
  z-index: 2;
  text-transform: uppercase;
  text-align: left;
  padding: 10px 10px 10px 75px;

  h1, h2 {
    font-size: 18px;
    margin: 0;
    padding: 0;
  }

  h2 {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .avatar {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 9px;
    border-radius: 50px;
    width: 50px;
    height: 50px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(255, 255, 255, 0.24);

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
<template>
  <ion-page class="ion-page" id="common">
    <ion-header>
      <ion-toolbar>
        <ion-menu-button menu="start" slot="start" @click="openMenu">
          &nbsp;&nbsp;&nbsp;<fa icon="bars" type="fab" class="icon"></fa>
        </ion-menu-button>
        <ion-title><strong>Chatter</strong></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="container">

      <ion-grid class="main-list">

        <ion-row>
          <ion-col>
            <ion-button v-if="!loading"
                        mode="md" type="submit" expand="full" size="xl" class="icon-button" @click="findPartner">
              Find Partner &nbsp;
              <fa icon="search" type="fab" class="icon"></fa>
            </ion-button>
            <ion-button v-else
                        mode="md" type="submit" expand="full" size="xl" class="icon-button" @click="cancelSearching">
              Cancel &nbsp;
              <fa icon="spinner" type="fab" class="icon" spin ></fa>
            </ion-button>
          </ion-col>
        </ion-row>

      </ion-grid>
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

export default {
  name: `home`,
  inject: ['openMenu', 'SocketIOService'],
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
      loading: false,
    }
  },
  async mounted() {
    if (await this.user) {
      this.SocketIOService.socket.on(`${this.user.id}.found`, async (data) => {
        console.log(data)
        const {partner} = data;
        await this.updatePartner(partner);
        await this.$router.replace(`/chat/stranger/${partner.id}`);
      });
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('partner', ['updatePartner']),

    findPartner: async function () {
      console.log('Searching for new partner');
      this.loading = true;
      await this.SocketIOService.socket.emit("search", {
        socketId: this.SocketIOService.socket.id
      });
    },

    cancelSearching: async function () {
      console.log('Cancelled searching for new partner')
      await this.SocketIOService.socket.emit("cancel-search", {
        socketId: this.SocketIOService.socket.id
      });
      this.loading = false;
    }
  },
}

</script>

<style lang="scss">
:root {
  --ion-safe-area-top: 20px;
  --ion-safe-area-bottom: 22px;
}
</style>
<style scoped lang="scss">
/*--------------------
Mixins
--------------------*/
@mixin center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/*--------------------
Body
--------------------*/
.container {
  margin: 0;
  padding: 0;
  position: relative;
}

/*---------------------
Layout
---------------------*/
.main-list {
  @include center;
}

</style>

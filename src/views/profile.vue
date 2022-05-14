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
            <ion-item>
              <ion-label><strong>Name</strong></ion-label>
              <ion-input type="text" maxlength="20" v-model="name"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label><strong>Age</strong></ion-label>
              <ion-input type="number" min="10" max="65" maxlength="2" v-model="age"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-list>
              <ion-radio-group :value="sex">
                <ion-list-header>
                  <ion-label><strong>&nbsp;&nbsp;&nbsp;&nbsp;Gender</strong></ion-label>
                </ion-list-header>

                <ion-item>
                  <ion-label>Male</ion-label>
                  <ion-radio slot="start" value="male" @click="sex = 'male'"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>Female</ion-label>
                  <ion-radio slot="start" value="female" @click="sex = 'female'"></ion-radio>
                </ion-item>

<!--                <ion-item>-->
<!--                  <ion-label>Gay</ion-label>-->
<!--                  <ion-radio slot="start" value="gay" @click="sex = 'gay'"></ion-radio>-->
<!--                </ion-item>-->

<!--                <ion-item>-->
<!--                  <ion-label>Lesbian</ion-label>-->
<!--                  <ion-radio slot="start" value="lesbian" @click="sex = 'lesbian'"></ion-radio>-->
<!--                </ion-item>-->

<!--                <ion-item>-->
<!--                  <ion-label>Trans</ion-label>-->
<!--                  <ion-radio slot="start" value="trans" @click="sex = 'trans'"></ion-radio>-->
<!--                </ion-item>-->
              </ion-radio-group>
            </ion-list>
          </ion-col>
        </ion-row>

      </ion-grid>
    </ion-content>

    <ion-footer>
      <ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="8">
            </ion-col>
            <ion-col>
              <ion-button mode="md" type="submit"
                          size="lg" class="icon-button"
                          @click="save">
                Save &nbsp; <fa icon="save" type="fab" class="icon"></fa>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-footer>
  </ion-page>
</template>

<script lang="js">
import {
  IonPage,
  IonModal,
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
  name: `profile`,
  inject: ['openMenu', 'AxiosService'],
  components: {
    IonPage,
    IonModal,
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
      name: '',
      sex: '',
      age: '',
    };
  },
  async mounted() {
    const user = await this.user;
    console.log(this.user);
    this.name = user.name || 'Anonymous';
    this.age = user.age || 25;
    this.sex = user.sex || 'male';
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('user', ['updateUserName', 'updateUserSex', 'updateUserAge']),

    save: async function () {
      if (this.name.length > 0) {
        await this.updateUserName(this.name);
      }
      if (this.age >= 10 && this.age <= 65) {
        await this.updateUserAge(this.age);
      }
      if (['male', 'female', 'gay', 'lesbian', 'trans'].includes(this.sex)) {
        await this.updateUserSex(this.sex);
      }
      this.AxiosService.patch(process.env.VUE_APP_SOCKET_ENDPOINT + `/user/${this.user.id}`, {
        name: this.user.name,
        age: this.user.age,
        sex: this.user.sex,
      })
          .then(async ({data}) => {
            await this.$router.replace('/home');
          })
          .catch((error) => {
            console.error(error.response.message);
          });
    },
  },
  watch: {
    age: function (value) {
      if (value) {
        this.age = value.toString().substring(0,2);
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

/*--------------------
Body
--------------------*/
.container {
  margin: 0;
  padding: 0;
  position: relative;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background: #333333 url('../assets/images/map.jpg') no-repeat 0 0;
  background-size: cover;
  filter: blur(100px);
}


/*--------------------
Chat
--------------------*/
.main-list {
  padding: 20px 0;
  //@include center;
  //z-index: 2;
  //overflow: hidden;
  //box-shadow: 0 5px 30px rgba(0, 0, 0, .2);
  //background: rgba(0, 0, 0, .5);
  //display: flex;
  //justify-content: space-between;
  //flex-direction: column;
}

</style>

<template>
  <div class="row justify-evenly">
    <div class="row justify-evenly">
      <div class="column q-mx-lg col-md-5 col-sm-10 col-xs-10">
        <q-btn
          icon=""
          outline
          style="color: #ff0080; font-weight: bold; width: 300px"
          color="primary"
          label="Auction Distribution"
          class="q-mt-none q-mb-sm"
          value="Auction Distribution"
          
        />
        <q-img
          class="q-mt-sm"
          style="border-radius: 1.5%"
          src="~assets/placeholder-images/painting.jpg"
          alt=""
        >
        </q-img>
        <div
          class="
            column
            items-end
            col-md-3 col-sm-3 col-xs-3
            justify-evenly
            q-ml-sm
            
          "
        >
          <q-icon
            style=""
            class=""
            color="primary"
            size="sm"
            name="mdi-heart-outline"
          />
          <q-icon
            class=""
            color="primary"
            size="sm"
            name="mdi-arrow-expand"
            style=""
          />
        </div>
      </div>
      <div
        class="row q-mx-lg col-md-5 col-sm-10 col-xs-10"
        style="border-left: 1px solid #ff0080"
      >
        <div class="row col-md-12 col-sm-12 col-xs-12">
          <div class="row col-md-12 col-sm-12 col-xs-12">
            <div class="q-ml-lg">
              <div class="text-bold" style="font-size: 32px; width: 300px">
                Abstract Art Bind Number 91
              </div>
              <div class="" style="font-size: 22px">Sale 1 of 1</div>
              <div class="" style="font-size: 21px; color: #c4c4c4">
                #Art #Abstract #Ai
              </div>
            </div>
            <div class="">
              <q-img
                class="items-end img"
                src="~assets/icons/bidblock.svg"
                style="height: 131px; width: 131px;"
              />
            </div>
          </div>
        </div>

        <div class="q-ml-sm">
          <div class="" style="height:380px; width: 500px; margin-left: 20px">
            <q-tabs
              dense
              v-model="tab"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              arrow-indicator
              mobile-arrows
            >
              <q-tab style="" name="info" label="Info" />
              <q-tab name="bids" label="Bids" />
              <q-tab name="previousowners" label="Previous Owners" />
              <q-tab name="history" label="History" />
            </q-tabs>
            <q-tab-panels class="q-mt-none" v-model="tab" animated>
              <q-tab-panel name="info">
                <div class="q-my-md column text-h6 ">
                  <q-item>
                    <q-item-section>
                      <q-avatar class="" style="">
                        <img
                          src="https://randomuser.me/api/portraits/men/5.jpg"
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section class="col-5">
                      <q-item-label
                        style="
                          font-weight: bold;
                          font-size: 18px;
                          margin-left: 5px;
                        "
                        >Owner</q-item-label
                      >
                      <q-item-label
                        style="
                          font-weight: bold;
                          font-size: 12px;
                          color: #ff0080;
                          margin-left: 5px;
                        "
                        >Dave</q-item-label
                      >
                    </q-item-section>
                    <q-item-section class="col-5">
                      <q-item-label
                        style="
                          font-weight: bold;
                          font-size: 14px;
                          width: 132px;
                          height: 48px;
                          color: #ff0080;
                          margin-left: 5px;
                        "
                      ></q-item-label>
                    </q-item-section>
                  </q-item>
                  <div class="q-my-md column">
                    <q-item class="">
                      <q-item-section>
                        <q-avatar class="">
                          <img
                            src="https://randomuser.me/api/portraits/men/4.jpg"
                          />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 18px;
                            margin-left: 5px;
                          "
                          >Creator</q-item-label
                        >
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 12px;
                            color: #ff0080;
                            margin-left: 5px;
                          "
                          >Rave</q-item-label
                        >
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 14px;
                            width: 132px;
                            height: 48px;
                            margin-left: 5px;
                          "
                          >10% of sales will go to creator</q-item-label
                        >
                      </q-item-section>
                    </q-item>

                    <q-separator color="primary" inset></q-separator>
                  </div>
                  <div class="q-my-md column">
                    <q-item>
                      <q-item-section>
                        <q-avatar class="">
                          <img
                            src="https://randomuser.me/api/portraits/men/12.jpg"
                          />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 18px;
                            margin-left: 5px;
                          "
                          >Collection</q-item-label
                        >
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 12px;
                            color: #ff0080;
                            margin-left: 5px;
                          "
                          >ArTbs</q-item-label
                        >
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 14px;
                            width: 132px;
                            height: 48px;
                            color: #ff0080;
                            margin-left: 5px;
                          "
                          >5% of sales will go to investors</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="bids">
                <div class="text-h6">
                  <div class="q-my-lg column text-h6">
                    <q-item>
                      <q-item-section>
                        <q-avatar class="" style="max-width: 600px">
                          <img
                            src="https://randomuser.me/api/portraits/women/5.jpg"
                          />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 18px;
                            color: #00b412;
                            margin-left: 5px;
                          "
                          >5.00 USD
                        </q-item-label>
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 12px;
                            color: #ff0080;
                            margin-left: 5px;
                          "
                          >Alicia</q-item-label
                        >
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label style="font-size: 14px; margin-left: 5px"
                          >10% BidBack
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
                <div class="text-h6">
                  <div class="q-my-md column text-h6">
                    <q-item>
                      <q-item-section>
                        <q-avatar class="" style="max-width: 600px">
                          <img
                            src="https://randomuser.me/api/portraits/men/5.jpg"
                          />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 18px;
                            color: #00b412;
                            margin-left: 5px;
                          "
                          >4.50 USD</q-item-label
                        >
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 12px;
                            color: #ff0080;
                            margin-left: 5px;
                          "
                          >Mike</q-item-label
                        >
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label style="font-size: 14px; margin-left: 5px"
                          >5% BidBack</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
                <div class="text-h6">
                  <div class="q-my-md column text-h6">
                    <q-item>
                      <q-item-section>
                        <q-avatar class="" style="max-width: 600px">
                          <img
                            src="https://randomuser.me/api/portraits/men/5.jpg"
                          />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 18px;
                            color: #00b412;
                            margin-left: 5px;
                          "
                          >Alice</q-item-label
                        >
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 12px;
                            color: #ff0080;
                            margin-left: 5px;
                          "
                          >4.00 USD</q-item-label
                        >
                      </q-item-section>
                      <q-item-section class="col-5">
                        <q-item-label
                          style="
                            font-weight: bold;
                            font-size: 14px;
                            margin-left: 5px;
                          "
                          >15% BidBack</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="previousowners">
                <div class="text-h6">
                  <div class="text-h6 q-mb-lg">
                    <div class="q-my-lg column text-h6">
                      <q-item class="q-mb-lg">
                        <q-item-section>
                          <q-avatar class="" style="max-width: 600px">
                            <img
                              src="https://randomuser.me/api/portraits/men/15.jpg"
                            />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section class="col-5">
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 18px;
                              margin-left: 5px;
                            "
                            >Old Owner</q-item-label
                          >
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 12px;
                              color: #ff0080;
                              margin-left: 5px;
                            "
                            >Dave</q-item-label
                          >
                        </q-item-section>
                        <q-item-section class="col-5">
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 14px;
                              width: 132px;
                              height: 48px;
                              color: #ff0080;
                              margin-left: 5px;
                            "
                          ></q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-avatar class="q-mb-lg" style="max-width: 600px">
                            <img
                              src="https://randomuser.me/api/portraits/women/8.jpg"
                            />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section class="col-5">
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 18px;
                              margin-left: 5px;
                            "
                            >Old Owner</q-item-label
                          >
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 12px;
                              color: #ff0080;
                              margin-left: 5px;
                            "
                            >Keyne</q-item-label
                          >
                        </q-item-section>
                        <q-item-section class="col-5">
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 14px;
                              width: 132px;
                              height: 48px;
                              color: #ff0080;
                              margin-left: 5px;
                            "
                          ></q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-avatar class="" style="max-width: 600px">
                            <img
                              src="https://randomuser.me/api/portraits/women/82.jpg"
                            />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section class="col-5">
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 18px;
                              margin-left: 5px;
                            "
                            >Old Owner</q-item-label
                          >
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 12px;
                              color: #ff0080;
                              margin-left: 5px;
                            "
                            >Alice</q-item-label
                          >
                        </q-item-section>
                        <q-item-section class="col-5">
                          <q-item-label
                            style="
                              font-weight: bold;
                              font-size: 14px;
                              width: 132px;
                              height: 48px;
                              color: #ff0080;
                            "
                          ></q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="history">
                <div class="q-my-lg column text-h6">
                  <q-item>
                    <q-item-section>
                      <q-avatar class="q-mb-lg" style="max-width: 600px">
                        <img
                          src="https://randomuser.me/api/portraits/men/15.jpg"
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section class="col-10">
                      <q-item-label style="font-weight: bold; font-size: 18px"
                        >Offered 5 USD for 2 days ago</q-item-label
                      >
                      <q-item-label
                        style="
                          font-weight: bold;
                          font-size: 12px;
                          color: #ff0080;
                        "
                        >by Dave</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-avatar class="" style="max-width: 600px">
                        <img
                          src="https://randomuser.me/api/portraits/men/15.jpg"
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section class="col-10">
                      <q-item-label style="font-weight: bold; font-size: 18px"
                        >Offered 5 USD for 2 days ago</q-item-label
                      >
                      <q-item-label
                        style="
                          font-weight: bold;
                          font-size: 12px;
                          color: #ff0080;
                        "
                        >by Dave</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <q-item>
            <q-item-section class="">
              <q-avatar class="" style="margin-left: 16px">
                <img src="https://randomuser.me/api/portraits/women/2.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-10">
              <q-item-label
                style="font-weight: bold; font-size: 18px; margin-left: 5px"
                >Highest bid by
                <spam style="color: #ff0080">MattPress</spam></q-item-label
              >
              <q-item-label
                style="
                  font-weight: bold;
                  font-size: 12px;
                  color: #00b412;
                  margin-left: 5px;
                "
                >5.00 USD</q-item-label
              >
            </q-item-section>
          </q-item>
          <div class="q-mt-none q-ml-lg col-">
            <q-btn
              class=""
              align="center"
              outline
              style="color: #ff0080; font-weight: bold; width:200px;"
              label="Place a Bid"
              color="primary"
              value="Place a Bid"
              
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 'info',
    };
  },
};
</script>

<style></style>

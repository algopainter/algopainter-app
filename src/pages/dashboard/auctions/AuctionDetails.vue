<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { AuctionItem } from 'components/auctions';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AuctionItem,
    AlgoButton,
  },
})
export default class AuctionDetails extends Vue {
}
</script>

<style lang="scss" scoped>

</style>
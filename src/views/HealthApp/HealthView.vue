<template>
 
  <div class="page-container ">
    <HealthEdit ref="healthEdit" v-if="showHealthEdit" />
    <HealthInfo v-else />

      <div class="flex justify-center mt-4">
        <button
          v-if="!showDoneButton"
          type="button"
          class="text-white bg-[#140A4B] border border-gray-300 focus:outline-none hover:bg-[#140a4bbc] focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5"
          @click="toggleHealthComponents"
        >
        เพิ่มข้อมูลสุขภาพ
        </button>

        <button
          v-if="showDoneButton"
          type="button"
          class="text-white bg-[#303030] border border-gray-300 focus:outline-none hover:bg-[#303030bc] focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5"
          @click="useEditHealth"
        >
        บันทึก
        </button>
        <button
          v-if="showDoneButton"
          type="button"
          class="text-white bg-[#EB1851] border border-gray-300 focus:outline-none hover:bg-[#eb1850c5] focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5"
          @click="cancelEdit"
        >
        ยกเลิก
        </button>
      </div>
    </div>
</template>

<script>
import HealthEdit from "@/views/HealthApp/Health-edit.vue";
import HealthInfo from "@/views/HealthApp/Health-info.vue";

export default {
  components: { HealthEdit, HealthInfo },
  data() {
    return {
      showHealthEdit: false,
      showDoneButton: false,
    };
  },
  methods: {
    toggleHealthComponents() {
      this.showHealthEdit = !this.showHealthEdit;
      this.showDoneButton = !this.showDoneButton;
    },
    async useEditHealth() {
      try {
        await this.$refs.healthEdit.editHealth();
        this.toggleHealthComponents();
      } catch (error) {
        console.error(error);
      }
    },
    cancelEdit() {
      this.toggleHealthComponents();
    },
  },
};
</script>

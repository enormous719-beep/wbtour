import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const message = ref("");
  const visible = ref(false);

  function showToast(msg) {
    message.value = msg;
    visible.value = true;

    setTimeout(() => {
      visible.value = false;
    }, 2000);
  }

  return {
    message,
    visible,
    showToast,
  };
});

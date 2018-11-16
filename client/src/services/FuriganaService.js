import Api from "@/services/Api";

export default {
  post(text) {
    return Api().post("furigana", { text: text });
  }
};

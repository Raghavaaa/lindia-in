import http from "k6/http";
import { sleep } from "k6";
export let options = {
  vus: 50,
  duration: "5m"
};
export default function() {
  http.get("https://api.legalindia.ai/health");
  sleep(1);
}


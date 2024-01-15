import {Toast} from "../../components/toast/Toast";
import {Button} from "../../components/button/Button";

export const toast = new Toast('toast')
const btn = new Button('toast-content')
btn.structural.smartphone.setLabel('inhoud van deze toast')
toast.contentInjection.smartphone.setTemplateComponent(btn)
// todo krijg ik de inhoud van de toast in mijn component?

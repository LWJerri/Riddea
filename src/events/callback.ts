import { avatarCallback } from "../callback/avatarCallback";
import { bondageCallback } from "../callback/bondageCallback";
import { hentaiCallback } from "../callback/hentaiCallback";
import { nekoCallback } from "../callback/nekoCallback";
import { thighsCallback } from "../callback/thighsCallback";
import { trapCallback } from "../callback/trapCallback";
import { wallpaperCallback } from "../callback/wallpaperCallback";

export async function callbackEvent(callback: any) {
    const action = callback.update.callback_query.data;

    // Callback type checks
    if (action == "NEW_AVATAR") return avatarCallback(callback);
    if (action == "NEW_BONDAGE") return bondageCallback(callback);
    if (action == "NEW_HENTAI") return hentaiCallback(callback);
    if (action == "NEW_NEKO") return nekoCallback(callback);
    if (action == "NEW_THIGHS") return thighsCallback(callback);
    if (action == "NEW_TRAP") return trapCallback(callback);
    if (action == "NEW_WALLPAPER") return wallpaperCallback(callback);
}

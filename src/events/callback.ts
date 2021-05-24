import {
    avatarCallback,
    bondageCallback,
    hentaiCallback,
    nekoCallback,
    thighsCallback,
    trapCallback,
    wallpaperCallback,
} from "../callback";
import helpCMD from "../commands/help";
import statusCMD from "../commands/status";

export default async function callbackEvent(callback: any) {
    const action = callback.update.callback_query.data;
    const message = callback;
    if (callback.update.callback_query.from.isBot) return;

    await callback.telegram
        .answerCbQuery(callback.update.callback_query.id)
        .catch(() => {});

    if (action == "NEW_AVATAR") return avatarCallback(callback);
    if (action == "NEW_BONDAGE") return bondageCallback(callback);
    if (action == "NEW_HENTAI") return hentaiCallback(callback);
    if (action == "NEW_NEKO") return nekoCallback(callback);
    if (action == "NEW_THIGHS") return thighsCallback(callback);
    if (action == "NEW_TRAP") return trapCallback(callback);
    if (action == "NEW_WALLPAPER") return wallpaperCallback(callback);
    if (action == "SEND_HELPMENU") return helpCMD(message);
    if (action == "SEND_STATISTIC") return statusCMD(message);
}

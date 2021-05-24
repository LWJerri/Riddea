export const description = "View all your uploaded images";

export default async function imagesCMD(message: any) {
    await message.scene.enter("myImages");
    return;
}

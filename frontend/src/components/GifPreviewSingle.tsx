import { Component } from "solid-js";
import { Gif } from "../client/Client";
import UAParser from "ua-parser-js";

export type Props = {
    gif: Gif;
    onClick?: () => void;
    tryForceCache?: boolean;
    tabIndex?: number;
    height?: string;
};

export const GifPreviewSingle: Component<Props> = (props: Props) => {
    const { gif, onClick } = props;
    // force indefinite caching
    // use webm if not on webkit/Safari (including the Tauri app on Linux/Mac)
    const canUseWebm = new UAParser().getBrowser().name !== "Safari";
    const previewVideoUrl = canUseWebm ? gif.previewVideoWebm ?? gif.previewVideo : gif.previewVideo;
    const previewUrl = previewVideoUrl != null ? previewVideoUrl : gif.previewGif ?? gif.url;
    if (props.tryForceCache) {
        caches
            .open("kitty-gifs")
            .then(cache => {
                cache.add(previewUrl).catch(e => { });
            })
            .catch(e => { });
    }
    const extraProps = {};
    let style = { "width": "100%", "height": props.height ?? "80%", "object-fit": "contain" };
    // if (gif.size) {
    //     // sizeProps["width"] = gif.size.width;
    //     // sizeProps["height"] = gif.size.height;
    //     style["max-height"] = `${gif.size.height}px`;
    // }
    if (props.tabIndex != null) {
        extraProps["tabindex"] = props.tabIndex;
    }
    if (previewVideoUrl != null) {
        return (
            <video
                autoplay
                loop
                muted
                playsinline
                src={previewUrl}
                class="gifPreview"
                style={style}
                onclick={onClick}
                {...extraProps}
            />
        );
    } else {
        return (
            <img
                src={previewUrl}
                class="gifPreview"
                style={style}
                onclick={onClick}
                {...extraProps}
            />
        );
        // return <object type="image/gif" data={previewUrl} class="gifPreview" style={style} onclick={onClick} {...sizeProps} />;
    }
};

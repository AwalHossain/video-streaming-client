import './player.css';

import { useEffect, useRef } from 'react';

import {
    isHLSProvider,
    MediaPlayer,
    MediaProvider,
    Poster
} from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export default function Player() {
    let player = useRef(null);
    const muxPlaybackId = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';
    const src = `https://stream.mux.com/${muxPlaybackId}.m3u8`;

    useEffect(() => {
        // Subscribe to state updates.
        return player.current.subscribe(({ paused, viewType }) => {
            // console.log('is paused?', '->', paused);
            // console.log('is audio view?', '->', viewType === 'audio');
        });
    }, []);

    function onProviderChange(provider, nativeEvent) {
        // We can configure provider's here.
        if (isHLSProvider(provider)) {
            provider.config = {};
        }
    }

    // We can listen for the `can-play` event to be notified when the player is ready.
    function onCanPlay(detail, nativeEvent) {
        // ...
    }

    return (
        <>
            <MediaPlayer
                className="player"
                title="Sprite Fight"
                src={src}
                crossorigin
                playsinline
                onProviderChange={onProviderChange}
                onCanPlay={onCanPlay}
                ref={player}
            >
                <MediaProvider>
                    <Poster
                        className="vds-poster"
                        src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
                        alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
                    />
                </MediaProvider>

                {/* Layouts */}
                <DefaultVideoLayout
                    icons={defaultLayoutIcons}
                    thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
                />
            </MediaPlayer>
        </>
    );
}
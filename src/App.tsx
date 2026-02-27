import React from "react";
import "./styles/index.less";
import {
	ApiRequest,
	TRIGGER_ID,
} from "@rocketman-system/streamkit-widget-helper";
import { randomInt } from "@xxanderwp/jstoolkit";

const battaryIcon = require("./media/battary.svg").default;

const audio = new Audio(require("./media/camera.mp3").default);

export const App = React.memo(() => {
	const [loaded, setLoaded] = React.useState(false);
	const [show, setShow] = React.useState(true);
	const [data, setData] = React.useState<{
		/** ID of the effect these data belong to */
		effectId: string;
		/** Unique ID of this trigger */
		triggerId: string;
		/** How long to display the effect (in seconds) */
		seconds: number;
		/** Effect volume level (0-100) */
		volume: number;
		/** Name of the effect sender */
		name?: string;
		/** Message from the sender */
		message?: string;
		/** Donation amount (if donation)
		 * @example 100 USD
		 */
		amount?: string;
	}>();
	const [screenshot, setScreenshot] = React.useState<string>();

	React.useEffect(() => {
		ApiRequest("GET", "private/effect/loadData", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setData(data);
			setLoaded(true);
		});

		ApiRequest("GET", "private/screen/screenshot", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setScreenshot(data);
		});
	}, []);

	React.useEffect(() => {
      let off = false;

      const tick = () => {
        if (off) {
          return;
        }

        setTimeout(
          () => {
            setShow(old => !old);
            tick();
            ApiRequest("GET", "private/screen/screenshot", {
				triggerId: TRIGGER_ID,
			}).then((data) => {
				if(!off)
				setScreenshot(data);
			});
          },
          randomInt(100, 500)
        );
      };

      tick();

      return () => {
        off = true;
      };
    }, []);

	React.useEffect(() => {
		if (!loaded || !data?.volume) return;
		audio.currentTime = 0;
		audio.play();
		audio.autoplay = true;
		audio.volume = data.volume / 100;

		audio.onended = () => {
			audio.currentTime = 0;
			audio.play();
		};

		return () => {
			audio.pause();
		};
	}, [loaded, data]);

	if (!loaded || !screenshot) return <></>;

	return (
      <>
        {show ? <img className="badscreen" src={screenshot} /> : <></>}
      </>
    );
});

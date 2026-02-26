import React from "react";
import "./styles/index.less";
import {
	ApiRequest,
	TRIGGER_ID,
} from "@rocketman-system/streamkit-widget-helper";

const battaryIcon = require("./media/battary.svg").default;

const audio = new Audio(require("./media/camera.mp3").default);

export const App = React.memo(() => {
	const [loaded, setLoaded] = React.useState(false);
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

	React.useEffect(() => {
		ApiRequest("GET", "private/effect/loadData", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setData(data);
			setLoaded(true);
		});
	}, []);

	React.useEffect(() => {
		if (!loaded || !data?.volume) return;
		audio.currentTime = 0;
		audio.play();
		audio.autoplay = true;
		audio.volume = data.volume / 100;

		audio.onended = () => {
			audio.currentTime = 8.13;
			audio.play();
		};

		const int = setInterval(() => {
			if (audio.currentTime >= 16.0) {
				audio.currentTime = 8.13;
				audio.play();
			}
		}, 100);

		return () => {
			clearInterval(int);
			audio.pause();
		};
	}, [loaded, data]);

	if (!loaded) return <></>;

	return (
		<div className="effectMain">
			<div className="camera">
				<div className="top">
					<div>
						<div className="circle" /> REC
					</div>
					<div></div>
					<div>
						LOW BATTERY <img src={battaryIcon} className={"batteryIcon"} />
					</div>
				</div>
				<div>
					<div></div>
					<div>
						<div className="overlay">
							<div className="overlay-element top-left"></div>
							<div className="overlay-element top-right"></div>
							<div className="overlay-element bottom-left"></div>
							<div className="overlay-element bottom-right"></div>
						</div>
					</div>
					<div></div>
				</div>
				<div>
					<div>
						ISO 100
						{data?.name && (
							<>
								<br />
								{data.name}
							</>
						)}
					</div>
					<div></div>
					<div>
						{Math.floor((window.innerHeight + window.innerWidth) / 100)} Mbps
						<br />
						{window.innerHeight}x{window.innerWidth}
						<br />
						FPS 60
					</div>
				</div>
			</div>
		</div>
	);
});

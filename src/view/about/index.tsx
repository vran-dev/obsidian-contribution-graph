import { Locals } from "src/i18/messages";
import "./index.css";
import { Tab } from "../tab/Tab";

export function About() {
	const local = Locals.get();
	return (
		<div className="about-container">
			<div className="about-item">
				<div className="label">{local.form_contact_me}</div>
				<a href="https://mp.weixin.qq.com/s/k5usslOZwWNFT5rlq3lAPA">
					微信公众号
				</a>
				<a href="https://github.com/vran-dev">Github</a>
			</div>

			<div className="about-item">
				<div className="label">{local.form_project_url}</div>
				<div>
					<a href="https://github.com/vran-dev/obsidian-contribution-graph">
						https://github.com/vran-dev/obsidian-contribution-graph
					</a>
				</div>
			</div>

			<div className="about-item">
				<div className="label">{local.form_sponsor}</div>
				<div>
					<Tab
						activeIndex={0}
						tabs={[
							{
								title: "微信",
								children: (
									<a href="https://mp.weixin.qq.com/s/k5usslOZwWNFT5rlq3lAPA">
										<img src="https://s2.loli.net/2022/05/23/phDIKagHwjZl3kA.jpg" />
									</a>
								),
							},
							{
								title: "Buy me a coffee",
								children: (
									<a href="https://www.buymeacoffee.com/vran">
										<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" />
									</a>
								),
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}

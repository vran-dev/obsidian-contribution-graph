import { ReactNode, useState } from "react";
import { Divider } from "../divider/Divider";

export function Tab(props: {
	tabs: TabItemOption[];
	activeIndex?: number;
}): JSX.Element {
	const [activeIndx, setActiveIndx] = useState(props.activeIndex || 0);
	return (
		<div className="tab-container">
			<div className="tab-titles">
				{props.tabs.map((tab, index) => {
					return (
						<TabTitle
							key={index}
							active={index == activeIndx}
							{...tab}
							onClick={() => {
								setActiveIndx(index);
								tab.onClick?.();
							}}
						/>
					);
				})}
			</div>
      <Divider />
			<div className="tab-items">
				{props.tabs.map((tab, index) => {
					return (
						<TabItem
							key={index}
							title={tab.title}
							icon={tab.icon}
							active={index == activeIndx}
							onClick={() => {
								setActiveIndx(index);
								tab.onClick?.();
							}}
						>
							{tab.children}
						</TabItem>
					);
				})}
			</div>
		</div>
	);
}

export function TabTitle(props: {
	title: string;
	icon?: ReactNode;
	children?: ReactNode;
	active?: boolean;
	onClick?: () => void;
}): JSX.Element {
	const { title, icon, active } = props;
	return (
		<div
			className={`tab-item-title ${active ? "active" : ""}`}
			onClick={(e) => props.onClick?.()}
		>
			{icon && <span>{icon}</span>}
			<span>{title}</span>
		</div>
	);
}

export function TabItem(props: {
	title: string;
	icon?: ReactNode;
	children?: ReactNode;
	active?: boolean;
	onClick?: () => void;
}): JSX.Element {
	const { children, active } = props;
	return (
		<div className={`tab-item ${active ? "active" : ""}`}>
			<div className="tab-item-content">{children}</div>
		</div>
	);
}

export interface TabItemOption {
	title: string;
	icon?: ReactNode;
	children?: ReactNode;
	onClick?: () => void;
}

declare module '@skeletonlabs/floating-ui-svelte' {
	export function useFloating(config: {
		reference: HTMLElement;
		floating: HTMLElement;
		placement?: string;
	}): {
		update: () => void;
	};
}

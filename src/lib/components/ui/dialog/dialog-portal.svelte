<script lang="ts">
// biome-ignore lint/style/useImportType: <explanation>
import { Dialog as DialogPrimitive } from "bits-ui";

type $$Props = DialogPrimitive.PortalProps;
</script>

<DialogPrimitive.Portal {...$$restProps}>
	<slot />
</DialogPrimitive.Portal>

<script lang="ts">
// biome-ignore lint/style/useImportType: <explanation>
import { Label as LabelPrimitive } from "bits-ui";
import { getFormControl } from "formsnap";
import { Label } from "$lib/components/ui/label/index.js";
import { cn } from "$lib/utils.js";

type $$Props = LabelPrimitive.Props;

let className: $$Props["class"] = undefined;
export { className as class };

const { labelAttrs } = getFormControl();
</script>

<Label {...$labelAttrs} class={cn("data-[fs-error]:text-destructive text-right", className)} {...$$restProps}>
	<slot {labelAttrs} />
</Label>

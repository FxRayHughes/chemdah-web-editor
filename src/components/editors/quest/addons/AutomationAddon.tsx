import { FormAddon, FormCheckbox } from '../../../ui';

interface AutomationAddonProps {
    addon: any;
    onChange: (newAddon: any) => void;
}

export function AutomationAddon({ addon, onChange }: AutomationAddonProps) {
    return (
        <FormAddon
            label="自动化 (Automation)"
            description="自动接受与计划任务"
            checked={!!addon?.automation}
            onChange={(checked) => {
                if (checked) {
                    onChange({ ...addon, automation: {} });
                } else {
                    const { automation, ...rest } = addon || {};
                    onChange(rest);
                }
            }}
        >
            <FormCheckbox
                label="自动接受 (Auto Accept)"
                checked={addon?.automation?.['auto-accept'] || false}
                onChange={(e) => onChange({
                    ...addon,
                    automation: { ...addon?.automation, 'auto-accept': e.currentTarget.checked }
                })}
            />
        </FormAddon>
    );
}

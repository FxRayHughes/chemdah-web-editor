import { FormAddon, FormTextarea } from '../../../ui';

interface DependAddonProps {
    addon: any;
    onChange: (newAddon: any) => void;
}

export function DependAddon({ addon, onChange }: DependAddonProps) {
    return (
        <FormAddon
            label="依赖 (Depend)"
            description="前置任务依赖"
            checked={!!addon?.depend}
            onChange={(checked) => {
                if (checked) {
                    onChange({ ...addon, depend: [] });
                } else {
                    const { depend, ...rest } = addon || {};
                    onChange(rest);
                }
            }}
        >
            <FormTextarea
                label="依赖列表 (每行一个)"
                placeholder="quest_id 或 group:name"
                value={Array.isArray(addon?.depend) ? addon.depend.join('\n') : ''}
                onChange={(e) => onChange({
                    ...addon,
                    depend: e.target.value.split('\n')
                })}
            />
        </FormAddon>
    );
}

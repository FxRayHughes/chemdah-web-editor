import { FormAddon, FormInput, FormTextarea, FormCheckbox } from '../../../ui';

interface TrackAddonProps {
    addon: any;
    onChange: (newAddon: any) => void;
    type: 'quest' | 'task';
}

export function TrackAddon({ addon, onChange, type }: TrackAddonProps) {
    return (
        <FormAddon
            label="追踪 (Track)"
            description="任务追踪设置"
            checked={!!addon?.track}
            onChange={(checked) => {
                if (checked) {
                    onChange({ ...addon, track: {} });
                } else {
                    const { track, ...rest } = addon || {};
                    onChange(rest);
                }
            }}
        >
            {type === 'task' && (
                <>
                    <FormInput
                        label="追踪名称 (Name)"
                        value={addon?.track?.name || ''}
                        onChange={(e) => onChange({
                            ...addon,
                            track: { ...addon?.track, name: e.target.value }
                        })}
                    />
                    <FormInput
                        label="追踪中心 (Center)"
                        placeholder="world 0 80 0"
                        value={addon?.track?.center || ''}
                        onChange={(e) => onChange({
                            ...addon,
                            track: { ...addon?.track, center: e.target.value }
                        })}
                    />
                    <FormTextarea
                        label="追踪描述 (Description)"
                        value={Array.isArray(addon?.track?.description) ? addon.track.description.join('\n') : (addon?.track?.description || '')}
                        onChange={(e) => onChange({
                            ...addon,
                            track: { ...addon?.track, description: e.target.value.split('\n') }
                        })}
                    />
                    <FormCheckbox
                        label="启用信标 (Beacon)"
                        checked={addon?.track?.beacon || false}
                        onChange={(e) => onChange({
                            ...addon,
                            track: { ...addon?.track, beacon: e.currentTarget.checked }
                        })}
                    />
                    <FormCheckbox
                        label="启用导航 (Navigation)"
                        checked={addon?.track?.navigation || false}
                        onChange={(e) => onChange({
                            ...addon,
                            track: { ...addon?.track, navigation: e.currentTarget.checked }
                        })}
                    />
                </>
            )}
            {type === 'quest' && (
                <FormCheckbox
                    label="启用记分板追踪 (Scoreboard Track)"
                    checked={addon?.track?.scoreboard || false}
                    onChange={(e) => onChange({ 
                        ...addon, 
                        track: { ...addon?.track, scoreboard: e.currentTarget.checked } 
                    })}
                />
            )}
        </FormAddon>
    );
}

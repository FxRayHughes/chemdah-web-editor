import { Select, SelectProps } from '@mantine/core';

export function FormSelect(props: SelectProps) {
    return <Select searchable allowDeselect={false} nothingFoundMessage="无匹配选项" {...props} />;
}

import { Block } from 'next-dato-utils/components';
import * as Components from './blocks/index';

type BlockProps = { data: any; components?: any };

export default function StructuredBlock({ data, components }: BlockProps) {
	console.log('blocks', Object.keys(Components));
	return <Block data={data} components={components ?? Components} />;
}

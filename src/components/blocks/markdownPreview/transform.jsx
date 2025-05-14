import transform from '@diplodoc/transform';
import anchors from '@diplodoc/transform/lib/plugins/anchors';
import checkbox from '@diplodoc/transform/lib/plugins/checkbox';
import code from '@diplodoc/transform/lib/plugins/code';
import cut from '@diplodoc/transform/lib/plugins/cut';
import deflist from '@diplodoc/transform/lib/plugins/deflist';
import file from '@diplodoc/transform/lib/plugins/file';
import imsize from '@diplodoc/transform/lib/plugins/imsize';
import meta from '@diplodoc/transform/lib/plugins/meta';
import monospace from '@diplodoc/transform/lib/plugins/monospace';
import notes from '@diplodoc/transform/lib/plugins/notes';
import sup from '@diplodoc/transform/lib/plugins/sup';
import yfmTable from '@diplodoc/transform/lib/plugins/table';
import tabs from '@diplodoc/transform/lib/plugins/tabs';
import video from '@diplodoc/transform/lib/plugins/video';
import color from 'markdown-it-color';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';

export function toHTML(value) {
    return transform(value, {
        plugins: [
            anchors,
            code,
            cut,
            deflist,
            file,
            imsize,
            meta,
            monospace,
            notes,
            sup,
            tabs,
            video,
            yfmTable,
            checkbox,
            color,
            ins,
            mark,
            sub,
        ],
    }).result.html;
}

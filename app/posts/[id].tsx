// app/posts/[id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import fs from 'fs';
import path from 'path';
import { markdownToHtml } from '../../lib/markdown';

interface PostProps {
    contentHtml: string;
}

const postsDirectory = path.join(process.cwd(), 'content');

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.id as string;
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const markdown = fs.readFileSync(fullPath, 'utf8');
    const contentHtml = await markdownToHtml(markdown);

    return {
        props: {
            contentHtml,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const filenames = fs.readdirSync(postsDirectory);
    const paths = filenames.map(filename => ({
        params: { id: filename.replace(/\.md$/, '') },
    }));

    return {
        paths,
        fallback: false,
    };
};

export default function Post({ contentHtml }: PostProps) {
    return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}

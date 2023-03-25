import { readFileSync } from "fs";
import sanitize from "sanitize-filename";

const getFileContents = (filename: string) => readFileSync(`./public/shared-assets/${sanitize(filename)}.gexf`);

type ParamsType = {
    filename: string;
};

export async function loader({ params }: { params: ParamsType }) {
    const { filename } = params;
    const gexf = getFileContents(filename);
    return new Response(gexf, {
        status: 200,
        headers: {
            "Content-Type": "text/xml",
        },
    });
}

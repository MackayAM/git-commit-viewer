import { FALLBACK_AVATAR_URL } from '../lib/config';

const CommitGridTile = ({ data }) => {
    const generateFallbackAvatarUrl = () => {
        return `${FALLBACK_AVATAR_URL}&name=${data?.commit?.committer?.name?.split(" ").join('+')}`;
    }

    return <div className="flex flex-col">
        <div className="p-3 bg-white rounded shadow-md h-full">
            <a target="_blank" title="View User" href={data?.committer?.html_url || 'https://www.github.com/'}><div className="flex">
                <div className="relative mr-2 mb-2 w-10 min-w-10">
                    <img src={data?.committer?.avatar_url || generateFallbackAvatarUrl()} alt="User Avatar" />
                </div>
                <div className="relative text-left max-w-80 overflow-clip">
                    <p className="text-sm cursor-pointer font-semibold">
                        {data?.commit?.committer?.name || 'Not Provided'}
                    </p>
                    <p className="text-xs">
                        {data?.commit?.committer?.email || 'Not Provided'}
                    </p>
                </div>
            </div></a>
            <a target="_blank" title="View Commit" href={data?.html_url || "https://www.github.com/"}><div className="flex-auto p-2 justify-evenly">
                <div className="flex flex-wrap text-left">
                    <div className="flex justify-between w-full min-w-0">
                        <p className="text-xs cursor-pointer break-all overflow-y-clip">
                            {data?.commit?.message}
                        </p>
                    </div>
                </div>
                <div className="mt-1 text-xs text-left text-gray-400">{data?.commit?.committer?.date}</div>

            </div></a>
        </div>
    </div>
}

export default CommitGridTile;
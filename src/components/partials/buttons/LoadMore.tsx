import { clickClass } from "../../../../util/globalValues";
import { SimpleFunctionType } from "../../../../util/types";

export default function LoadMore({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  className,
}: {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: SimpleFunctionType;
  className?: string;
}) {
  return (
    <>
      {!isFetchingNextPage && hasNextPage && (
        <button
          className={`${className || ""} ${clickClass}`}
          onClick={(e) => {
            fetchNextPage();
          }}
        >
          Load More
        </button>
      )}
    </>
  );
}

import Link from "next/link";

export default function CategoryTag({ id, className, onClick = null, href = null }) {
  return (
    <>
      {onClick === false ? (
        <div
          className={`w-fit rounded-[20px] border text-[16px] border-primary p-2 py-0  text-primary ${className}`}
        >
          {id}
        </div>
      ) : (
        <Link
          href={href || `/category/${id}`}
          className={`w-fit rounded-[20px] border text-[16px] border-primary p-2 py-0  text-primary hover:text-white ${className}`}
        >
          {id}
        </Link>
      )}
    </>
  );
}

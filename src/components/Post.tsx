import Link from "next/link";

// function handleSubmit(event) {
//   event.preventDefault();
//   global.analytics.track("Form Submitted", {
//     data: "test data"
//   });
// }

export default (props: any) => {
  return (
    <article>
      <h2>{props.title}</h2>
      <p>{props.body}</p>
      {/* render the URL as /post/:id */}
      <Link
        href={{ pathname: "/post", query: { id: props.id } }}
        as={`/post/${props.id}`}
      >
        <a>Read more...</a>
      </Link>
    </article>
  );
};

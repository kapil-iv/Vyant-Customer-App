import { useState } from "react";
import { createReviewApi } from "../reviewApi";

export function ReviewForm({ productId }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <article className="rounded border bg-vy-surface p-3">
      <h3 className="font-semibold">Write a review</h3>
      <form
        className="mt-2 space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await createReviewApi({ productId, rating, comment });
          setComment("");
        }}
      >
        <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value) || 5)} className="w-20 rounded border px-2 py-1 text-sm" />
        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
        <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Submit Review</button>
      </form>
    </article>
  );
}

interface Props {
  params: { slug: string };
}

export default function PortfolioDetailPage({ params }: Props) {
  return <div>Portfolio Detail: {params.slug}</div>;
}

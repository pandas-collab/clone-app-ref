interface Props {
  params: { slug: string };
}

export default function ServiceDetailPage({ params }: Props) {
  return <div>Service Detail: {params.slug}</div>;
}

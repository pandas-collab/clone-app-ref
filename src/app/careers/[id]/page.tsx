interface Props {
  params: { id: string };
}

export default function CareerDetailPage({ params }: Props) {
  return <div>Career Detail: {params.id}</div>;
}

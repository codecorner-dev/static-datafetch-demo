import { useEffect, useState } from "react";
import useSWR from "swr";

export default function LastSales(props) {
  const [sales, setSales] = useState(props.sales);
  //const [loading, setLoading] = useState(false);

  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data, error } = useSWR(
    "https://static-datafetch-demo-default-rtdb.firebaseio.com/sales.json",
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (data) {
      const salesArr = [];

      for (const key in data) {
        salesArr.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(salesArr);
    }
  }, [data]);

  if (error) {
    return <p>failed to load!</p>;
  }
  if (!data && !sales) {
    return <p>loading...</p>;
  }

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(
  //     "https://static-datafetch-demo-default-rtdb.firebaseio.com/sales.json"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const salesArr = [];

  //       for (const key in data) {
  //         salesArr.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }

  //       setSales(salesArr);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    "https://static-datafetch-demo-default-rtdb.firebaseio.com/sales.json"
  );
  const data = await response.json();

  const salesArr = [];

  for (const key in data) {
    salesArr.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }

  return { props: { sales: salesArr } };
}

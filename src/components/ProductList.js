import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';

const ProductList = ({ pageTitle }) => {
  const [searchType, setSearchType] = useState('optional');
  const [searchValue, setSearchValue] = useState('');
  const [productList, setProductList] = useState([]);
  const [selected, setSelected] = useState({});

  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    loadProduct();
  }, []);

  // 상품 목록을 백엔드에 요청하는 함수
  const loadProduct = async (number, size) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/product/list`,
    );
    const data = await res.json();
    console.log(data.result);

    setProductList(data.result);
  };

  // 장바구니 클릭 이벤트 핸들러
  const handleAddToCart = () => {};

  // 체크박스 클릭 이벤트 핸들러
  const handleCheckboxChange = () => {};

  return (
    <Container>
      <Grid
        container
        justifyContent='space-between'
        spacing={2}
        className='mt-5'
      >
        <Grid item>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadProduct();
            }}
          >
            <Grid container spacing={2}>
              <Grid item>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value='optional'>선택</MenuItem>
                  <MenuItem value='name'>상품명</MenuItem>
                  <MenuItem value='category'>카테고리</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <TextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  label='Search'
                />
              </Grid>
              <Grid item>
                <Button type='submit'>검색</Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        {!isAdmin && (
          <Grid item>
            <Button onClick={handleAddToCart} color='secondary'>
              장바구니
            </Button>
          </Grid>
        )}

        {isAdmin && (
          <Grid item>
            <Button href='/product/create' color='success'>
              상품등록
            </Button>
          </Grid>
        )}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant='h6' align='center'>
            {pageTitle}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제품사진</TableCell>
                <TableCell>제품명</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>재고수량</TableCell>
                {!isAdmin && <TableCell>주문수량</TableCell>}
                {!isAdmin && <TableCell>주문선택</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.imagePath}
                      alt={product.name}
                      style={{ height: '100px', width: 'auto' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  {!isAdmin && (
                    <TableCell>
                      <TextField
                        type='number'
                        value={product.quantity || 0}
                        onChange={(e) =>
                          setProductList((prevList) =>
                            prevList.map((p) =>
                              p.id === product.id
                                ? { ...p, quantity: parseInt(e.target.value) }
                                : p,
                            ),
                          )
                        }
                        style={{ width: '70px' }}
                      />
                    </TableCell>
                  )}
                  {!isAdmin && (
                    <TableCell>
                      <Checkbox
                        checked={!!selected[product.id]}
                        onChange={(e) =>
                          handleCheckboxChange(product.id, e.target.checked)
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductList;

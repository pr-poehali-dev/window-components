import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Уплотнитель EPDM", category: "seals", price: 450, unit: "м", image: "🔲" },
  { id: 2, name: "Уплотнитель силиконовый", category: "seals", price: 580, unit: "м", image: "🔲" },
  { id: 3, name: "Уплотнитель TPE", category: "seals", price: 520, unit: "м", image: "🔲" },
  { id: 4, name: "Подоконник белый 200мм", category: "sills", price: 890, unit: "м", image: "➖" },
  { id: 5, name: "Подоконник белый 300мм", category: "sills", price: 1200, unit: "м", image: "➖" },
  { id: 6, name: "Подоконник под дерево 250мм", category: "sills", price: 1450, unit: "м", image: "➖" },
  { id: 7, name: "Панель ПВХ белая", category: "panels", price: 320, unit: "м²", image: "⬜" },
  { id: 8, name: "Панель ПВХ цветная", category: "panels", price: 480, unit: "м²", image: "⬜" },
  { id: 9, name: "Панель ПВХ с рисунком", category: "panels", price: 650, unit: "м²", image: "⬜" },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("catalog");
  const [calcQuantity, setCalcQuantity] = useState<number>(1);
  const [calcProduct, setCalcProduct] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: "Добавлено в корзину",
      description: product.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCalcPrice = () => {
    const product = products.find(p => p.id === calcProduct);
    return product ? product.price * calcQuantity : 0;
  };

  const categoryNames: Record<string, string> = {
    all: "Все товары",
    seals: "Уплотнители",
    sills: "Подоконники",
    panels: "Панели ПВХ",
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Комплектующие для окон</h1>
              <p className="text-muted-foreground mt-1">Качественные детали и аксессуары</p>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              {cart.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="catalog" className="text-base">
              <Icon name="Grid3x3" size={20} className="mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-base">
              <Icon name="Calculator" size={20} className="mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="cart" className="text-base">
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Корзина
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-base">
              <Icon name="Phone" size={20} className="mr-2" />
              Контакты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="search" className="mb-2 block">Поиск товаров</Label>
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Введите название товара..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Label htmlFor="category-filter" className="mb-2 block">Категория</Label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                >
                  {Object.entries(categoryNames).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                Найдено товаров: <span className="font-semibold text-foreground">{getFilteredProducts().length}</span>
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить фильтры
                </Button>
              )}
            </div>

            {getFilteredProducts().length === 0 ? (
              <div className="text-center py-12">
                <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">Товары не найдены</p>
                <p className="text-muted-foreground mt-2">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredProducts().map(product => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-6xl text-center mb-4">{product.image}</div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary" className="w-fit">
                        {categoryNames[product.category]}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {product.price} ₽
                        </span>
                        <span className="text-muted-foreground">за {product.unit}</span>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full"
                      >
                        В корзину
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calculator">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Калькулятор стоимости</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="product">Выберите товар</Label>
                  <select
                    id="product"
                    value={calcProduct}
                    onChange={(e) => setCalcProduct(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price} ₽/{product.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Количество</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="bg-primary/10 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Итоговая стоимость:</span>
                    <span className="text-3xl font-bold text-primary">
                      {getCalcPrice().toFixed(2)} ₽
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    const product = products.find(p => p.id === calcProduct);
                    if (product) {
                      const existing = cart.find(item => item.id === product.id);
                      if (existing) {
                        setCart(cart.map(item => 
                          item.id === product.id 
                            ? { ...item, quantity: item.quantity + calcQuantity }
                            : item
                        ));
                      } else {
                        setCart([...cart, { ...product, quantity: calcQuantity }]);
                      }
                      toast({
                        title: "Добавлено в корзину",
                        description: `${product.name} - ${calcQuantity} ${product.unit}`,
                      });
                      setActiveTab("cart");
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  Добавить в корзину
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cart">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Корзина покупок</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-xl text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{item.image}</span>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.price} ₽ за {item.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 0.5)}
                            >
                              <Icon name="Minus" size={16} />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                              className="w-20 text-center"
                              step="0.1"
                              min="0.1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 0.5)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                          <span className="font-bold text-lg min-w-[120px] text-right">
                            {(item.price * item.quantity).toFixed(2)} ₽
                          </span>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="bg-primary/10 p-6 rounded-lg mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-semibold">Общая стоимость:</span>
                        <span className="text-4xl font-bold text-primary">
                          {getTotalPrice().toFixed(2)} ₽
                        </span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="lg">
                      Оформить заказ
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Контакты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Icon name="Phone" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <p className="text-lg">+7 (XXX) XXX-XX-XX</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Mail" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-lg">info@windows-parts.ru</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="MapPin" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Адрес</h3>
                    <p className="text-lg">г. Москва, ул. Примерная, д. 1</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Clock" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Режим работы</h3>
                    <p className="text-lg">Пн-Пт: 9:00 - 18:00</p>
                    <p className="text-lg">Сб-Вс: Выходной</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
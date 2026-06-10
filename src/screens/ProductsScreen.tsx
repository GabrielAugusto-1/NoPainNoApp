import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { CartContext } from "@/src/context/CartContext";
import { productService } from "@/src/service/productService";
import { Product } from "@/src/models/Product";
import { useNavigation } from "@react-navigation/native";

export default function ProductsScreen() {
  const navigation = useNavigation<any>();
  const { addToCart } = useContext(CartContext);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, priceFilter, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);

      const uniqueCategories = [...new Set(data.map((p: Product) => p.categoria))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = async () => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nome.toLowerCase().includes(query) ||
          p.categoria.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    result = result.filter(
      (p) => p.preco >= priceFilter.min && p.preco <= priceFilter.max
    );

    setFilteredProducts(result);
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f05006" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Buscar produtos..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="close" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity
              style={[
                styles.categoryBadge,
                !selectedCategory && styles.categoryBadgeActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  !selectedCategory && styles.categoryTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryBadge,
                  selectedCategory === category && styles.categoryBadgeActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Preço</Text>
          <View style={styles.priceFilterContainer}>
            <Text style={styles.priceLabel}>
              R$ {priceFilter.min.toFixed(2)} - R$ {priceFilter.max.toFixed(2)}
            </Text>
            <View style={styles.priceRange}>
              <TextInput
                placeholder="Mín"
                placeholderTextColor="#aaa"
                style={styles.priceInput}
                keyboardType="numeric"
                defaultValue={priceFilter.min.toString()}
                onChangeText={(text) =>
                  setPriceFilter({
                    ...priceFilter,
                    min: parseFloat(text) || 0,
                  })
                }
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                placeholder="Máx"
                placeholderTextColor="#aaa"
                style={styles.priceInput}
                keyboardType="numeric"
                defaultValue={priceFilter.max.toString()}
                onChangeText={(text) =>
                  setPriceFilter({
                    ...priceFilter,
                    max: parseFloat(text) || 1000,
                  })
                }
              />
            </View>
          </View>
        </View>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-bag" size={60} color="#999" />
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id!}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productImage}>
                <MaterialIcons name="image-not-supported" size={40} color="#666" />
              </View>

              <Text style={styles.productName} numberOfLines={2}>
                {item.nome}
              </Text>

              <Text style={styles.productCategory}>{item.categoria}</Text>

              <Text style={styles.productPrice}>R$ {item.preco.toFixed(2)}</Text>

              {item.marca && (
                <Text style={styles.productBrand}>{item.marca}</Text>
              )}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <MaterialIcons name="add-shopping-cart" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("Cart")}
      >
        <MaterialIcons name="shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#aaa",
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f05006",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 14,
  },
  filtersContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  filterSection: {
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  filterTitle: {
    color: "#f05006",
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f05006",
    backgroundColor: "transparent",
  },
  categoryBadgeActive: {
    backgroundColor: "#f05006",
  },
  categoryText: {
    color: "#f05006",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoryTextActive: {
    color: "#fff",
  },
  priceFilterContainer: {
    gap: 8,
  },
  priceLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f05006",
    borderRadius: 6,
    padding: 8,
    color: "#fff",
    fontSize: 12,
  },
  priceSeparator: {
    color: "#aaa",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#f05006",
  },
  productImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4,
  },
  productCategory: {
    color: "#aaa",
    fontSize: 11,
    marginBottom: 4,
  },
  productBrand: {
    color: "#888",
    fontSize: 10,
    marginBottom: 6,
  },
  productPrice: {
    color: "#f05006",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#f05006",
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    marginTop: 15,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f05006",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
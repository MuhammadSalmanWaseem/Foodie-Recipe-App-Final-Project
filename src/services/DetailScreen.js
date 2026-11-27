
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';

export default function DetailScreen({
  recipe,
  isFavorite,
  onToggleFavorite,
  onBack,
  onEdit,
  onDelete
}) {
  if (!recipe) return null;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 34 }}
      >
        {/* Recipe Image */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.hero}
          />

          <Pressable style={styles.back} onPress={onBack}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Pressable
            style={styles.heart}
            onPress={onToggleFavorite}
          >
            <Text style={styles.heartText}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>
            {recipe.category || 'RECIPE'}
            {recipe.area ? ` · ${recipe.area}` : ''}
          </Text>

          {/* Recipe Name */}
          <Text style={styles.title}>
            {recipe.name}
          </Text>

          {!!recipe.description && (
            <Text style={styles.description}>
              {recipe.description}
            </Text>
          )}

          {/* Recipe Information */}
          <View style={styles.stats}>
            {[
              ['◷', recipe.time || '—', 'PREP TIME'],
              ['♧', String(recipe.servings || '—'), 'SERVINGS'],
              ['✦', String(recipe.calories || '—'), 'CALORIES'],
              ['★', recipe.difficulty || '—', 'DIFFICULTY']
            ].map(([icon, value, label]) => (
              <View key={label} style={styles.stat}>
                <Text style={styles.statIcon}>{icon}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Edit and Delete */}
          {!!recipe.isCustom && (
            <View style={styles.actions}>
              <Pressable style={styles.edit} onPress={onEdit}>
                <Text style={styles.editText}>Edit Recipe</Text>
              </Pressable>

              <Pressable style={styles.delete} onPress={onDelete}>
                <Text style={styles.deleteText}>Delete Recipe</Text>
              </Pressable>
            </View>
          )}

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>
            Ingredients
          </Text>

          {(recipe.ingredients || []).map((item, index) => (
            <View
              style={styles.ingredient}
              key={`${index}-${item}`}
            >
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}

          {/* Cooking Instructions */}
          <Text style={styles.sectionTitle}>
            Instructions
          </Text>

          {(recipe.instructions || []).map((item, index) => (
            <View
              style={styles.step}
              key={`${index}-${item}`}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>
                  {index + 1}
                </Text>
              </View>

              <Text style={styles.stepText}>
                {item}
              </Text>
            </View>
          ))}

          {recipe.sourceUrl ? (
            <Text style={styles.source}>
              Source: {recipe.sourceUrl}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8F2'
  },
  imageWrap: {
    height: 270,
    backgroundColor: '#F0E3D9'
  },
  hero: {
    width: '100%',
    height: '100%'
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backText: {
    fontSize: 33,
    color: '#302720',
    lineHeight: 35,
    marginTop: -4
  },
  heart: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heartText: {
    color: '#E85D45',
    fontSize: 24
  },
  content: {
    padding: 22
  },
  category: {
    color: '#E47743',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  title: {
    color: '#29221E',
    fontWeight: '900',
    fontSize: 28,
    lineHeight: 33,
    marginTop: 8
  },
  description: {
    color: '#887A70',
    lineHeight: 21,
    marginTop: 9
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    marginTop: 20,
    marginBottom: 22,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#F0E6DD'
  },
  stat: {
    flex: 1,
    alignItems: 'center'
  },
  statIcon: {
    color: '#E47743',
    fontSize: 17
  },
  statValue: {
    color: '#352B25',
    fontWeight: '900',
    fontSize: 12,
    marginTop: 5
  },
  statLabel: {
    color: '#9A8D83',
    fontSize: 8,
    letterSpacing: 0.6,
    marginTop: 3,
    fontWeight: '800'
  },
  sectionTitle: {
    color: '#29221E',
    fontWeight: '900',
    fontSize: 20,
    marginBottom: 12,
    marginTop: 7
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: '#F0E6DD'
  },
  bullet: {
    color: '#E47743',
    fontWeight: '900',
    marginRight: 11
  },
  ingredientText: {
    color: '#5F544B',
    flex: 1,
    lineHeight: 20
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
    alignItems: 'flex-start'
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE5D2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepNumberText: {
    color: '#D66B3B',
    fontWeight: '900'
  },
  stepText: {
    flex: 1,
    color: '#5F544B',
    lineHeight: 21,
    paddingTop: 3
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  edit: {
    flex: 1,
    backgroundColor: '#F07843',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12
  },
  editText: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  delete: {
    flex: 1,
    backgroundColor: '#FCEBE8',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12
  },
  deleteText: {
    color: '#CA5146',
    fontWeight: '900'
  },
  source: {
    color: '#8B8179',
    fontSize: 11,
    marginTop: 15
  }
});

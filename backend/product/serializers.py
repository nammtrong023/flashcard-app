from rest_framework import serializers

from .models import Flashcard, FlashcardItem, Image, Product, Size


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['value']
        model = Size


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['url']
        model = Image


class ProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True)
    sizes = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(), many=True
    )

    class Meta:
        model = Product
        fields = '__all__'
        depth = 1

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sizes'] = SizeSerializer(
            instance.sizes.all(), many=True
        ).data
        return representation

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        sizes_data = validated_data.pop('sizes', [])

        product = Product.objects.create(**validated_data)

        for image_data in images_data:
            Image.objects.create(product=product, **image_data)

        product.sizes.set(sizes_data)

        return product
